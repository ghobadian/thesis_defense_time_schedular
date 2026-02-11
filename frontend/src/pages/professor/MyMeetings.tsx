// src/pages/professor/MyMeetings.tsx
import React, {useState} from 'react';
import {useQuery} from '@tanstack/react-query';
import {useNavigate} from 'react-router-dom';
import {professorAPI} from '../../api/professor.api';
import {MeetingView} from '../../components/common/MeetingView';
import {TimeSlotsComparison} from '../../components/professor/TimeSlotsComparison';
import {JuryScoresPanel} from '../../components/professor/JuryScoresPanel';
import {ScheduleMeetingModal} from '../../components/professor/ScheduleMeetingModal';
import {Meeting, MeetingState, UserRole} from '../../types';
import {useAuthStore} from '../../store/authStore';
import {Button} from '../../components/common/Button';

export const MyMeetings: React.FC = () => {
    const navigate = useNavigate();
    const { userId, role } = useAuthStore();
    const [scheduleMeetingModal, setScheduleMeetingModal] = useState<Meeting | null>(null);

    // Add refetch here ⬇️
    const { data: meetings, isLoading, error, refetch } = useQuery({
        queryKey: ['myMeetings'],
        queryFn: professorAPI.getMyMeetings,
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
        </>
    );
};

export default MyMeetings;
