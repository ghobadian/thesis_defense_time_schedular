// src/pages/professor/MyMeetings.tsx
import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { professorAPI } from '../../api/professor.api';
import { MeetingView } from '../../components/common/meeting/MeetingView';
import { TimeSlotsComparison } from '../../components/professor/TimeSlotsComparison';
import { JuryScoresPanel } from '../../components/professor/JuryScoresPanel';
import { ScheduleMeetingModal } from '../../components/professor/ScheduleMeetingModal';
import { JurySelectionModal } from '../../components/common/JurySelectionModal';
import { Meeting, MeetingState, UserRole } from '../../types';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../../components/common/Button';

export const ProfessorMeetingsPage: React.FC = () => {
    const navigate = useNavigate();
    const { userId, role } = useAuthStore();
    const [scheduleMeetingModal, setScheduleMeetingModal] = useState<Meeting | null>(null);
    const [reassignMeeting, setReassignMeeting] = useState<Meeting | null>(null);

    const { data: meetings, isLoading, error, refetch } = useQuery({
        queryKey: ['myMeetings'],
        queryFn: professorAPI.getMyMeetings,
    });

    // Cancel meeting mutation
    const cancelMeetingMutation = useMutation({
        mutationFn: (meetingId: number) => professorAPI.cancelMeeting(meetingId),
        onSuccess: () => {
            refetch();
        },
        onError: (error: any) => {
            const message =
                error?.response?.data?.message ||
                error?.message ||
                'Failed to cancel the meeting. Please try again.';
            alert(message);
        },
    });

    // Reassign juries mutation
    const reassignJuriesMutation = useMutation({
        mutationFn: ({ meetingId, juryIds }: { meetingId: number; juryIds: number[] }) =>
            professorAPI.reassignJuries(meetingId, juryIds),
        onSuccess: () => {
            setReassignMeeting(null);
            refetch();
        },
        onError: (error: any) => {
            const message =
                error?.response?.data?.message ||
                error?.message ||
                'Failed to reassign juries. Please try again.';
            alert(message);
        },
    });

    const canSelectTime = (meeting: Meeting): boolean => {
        return meeting.state === MeetingState.JURIES_SELECTED;
    };

    const isJuryMember = (meeting: Meeting): boolean => {
        if (!userId) return false;
        return meeting.juryMembers?.some(jury => jury.id === userId) ?? false;
    };

    const canSpecifyTime = (meeting: Meeting): boolean => {
        if (role === UserRole.MANAGER || role === UserRole.PROFESSOR) {
            return isJuryMember(meeting);
        }
        return true;
    };

    const canScheduleMeeting = (meeting: Meeting): boolean => {
        return role === UserRole.MANAGER &&
            meeting.state === MeetingState.STUDENT_SPECIFIED_TIME;
    };

    const canViewTimeSlots = (meeting: Meeting): boolean => {
        return [
            MeetingState.JURIES_SPECIFIED_TIME,
            MeetingState.STUDENT_SPECIFIED_TIME,
            MeetingState.SCHEDULED
        ].includes(meeting.state);
    };

    const canCancelMeeting = (meeting: Meeting): boolean => {
        if (meeting.state === MeetingState.COMPLETED || meeting.state === MeetingState.CANCELED) {
            return false;
        }
        return role === UserRole.MANAGER;
    };

    const canReassignJuries = (meeting: Meeting): boolean => {
        if (role !== UserRole.MANAGER) return false;
        return [
            MeetingState.JURIES_SELECTED,
            MeetingState.JURIES_SPECIFIED_TIME,
            MeetingState.STUDENT_SPECIFIED_TIME,
        ].includes(meeting.state);
    };

    const handleCancelMeeting = (meeting: Meeting) => {
        cancelMeetingMutation.mutate(meeting.id);
    };

    const handleMeetingAction = (meeting: Meeting) => {
        if (!canSpecifyTime(meeting)) {
            alert('You can only specify time for meetings where you are a jury member.');
            return;
        }
        navigate(`/professor/meetings/${meeting.id}/specify-time`);
    };

    const getActionButtonLabel = (meeting: Meeting): string | null => {
        if (!canSpecifyTime(meeting)) {
            return null;
        }

        if (meeting.state === MeetingState.JURIES_SELECTED ||
            meeting.state === MeetingState.JURIES_SPECIFIED_TIME) {
            return 'Specify Availability';
        }

        return null;
    };

    const handleReassignJuries = async (juryIds: number[]) => {
        if (!reassignMeeting) return;
        reassignJuriesMutation.mutate({ meetingId: reassignMeeting.id, juryIds });
    };

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-red-500">Failed to load meetings.</div>
            </div>
        );
    }

    return (
        <>
            <MeetingView
                meetings={meetings || []}
                isLoading={isLoading}
                onMeetingAction={handleMeetingAction}
                actionButtonLabel={getActionButtonLabel}
                showActionButton={canSelectTime}
                userRole="professor"
                canViewTimeSlots={canViewTimeSlots}
                renderTimeSlotsComparison={(meeting) => (
                    <TimeSlotsComparison meetingId={meeting.id} />
                )}
                onCancelMeeting={handleCancelMeeting}
                canCancelMeeting={canCancelMeeting}
                isCancelling={cancelMeetingMutation.isPending}
                onReassignJuries={(meeting) => setReassignMeeting(meeting)}
                canReassignJuries={canReassignJuries}
                renderAdditionalContent={(meeting, isExpanded) => (
                    <>
                        {/* Schedule Meeting Button for Manager */}
                        {canScheduleMeeting(meeting) && (
                            <div className="mt-4">
                                <Button
                                    variant="primary"
                                    onClick={() => setScheduleMeetingModal(meeting)}
                                >
                                    Schedule Meeting
                                </Button>
                            </div>
                        )}

                        {/* Jury Scores Panel - shows for SCHEDULED and COMPLETED */}
                        {(meeting.state === MeetingState.SCHEDULED ||
                            meeting.state === MeetingState.COMPLETED) && (
                            <JuryScoresPanel
                                meetingId={meeting.id}
                                meetingState={meeting.state}
                                juryMembers={meeting.juryMembers || []}
                                juriesScores={meeting.juriesScores || {}}
                                finalScore={meeting.score}
                                instructorId={meeting.thesis?.instructorId}
                                onScoreSubmitted={() => refetch()}
                            />
                        )}
                    </>
                )}
            />

            {/* Schedule Meeting Modal */}
            {scheduleMeetingModal && (
                <ScheduleMeetingModal
                    isOpen={!!scheduleMeetingModal}
                    onClose={() => setScheduleMeetingModal(null)}
                    meeting={scheduleMeetingModal}
                />
            )}

            {/* Reassign Juries Modal */}
            {reassignMeeting && (
                <JurySelectionModal
                    isOpen={!!reassignMeeting}
                    onClose={() => setReassignMeeting(null)}
                    meetingId={reassignMeeting.id}
                    formId={reassignMeeting.thesis?.id ?? 0}
                    onJuriesSelected={handleReassignJuries}
                    instructorId={reassignMeeting.thesis?.instructorId}
                    minJuryCount={3}
                />
            )}
        </>
    );
};

export default ProfessorMeetingsPage;
