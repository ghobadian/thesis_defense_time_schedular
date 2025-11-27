// src/pages/professor/MyMeetings.tsx
import React from 'react';
import {useQuery} from '@tanstack/react-query';
import {useNavigate} from 'react-router-dom';
import {professorAPI} from '../../api/professor.api';
import {MeetingView} from '../../components/common/MeetingView';
import {TimeSlotsComparison} from '../../components/professor/TimeSlotsComparison';
import {Meeting, MeetingState, UserRole} from '../../types';
import {useAuthStore} from '../../store/authStore';

export const MyMeetings: React.FC = () => {
    const navigate = useNavigate();
    const { userId, role } = useAuthStore();

    const { data: meetings, isLoading, error } = useQuery({
        queryKey: ['myMeetings'],
        queryFn: professorAPI.getMyMeetings,
    });

    // Check if user is a jury member for a specific meeting
    const isJuryMember = (meeting: Meeting): boolean => {
        if (!userId) return false;
        return meeting.juryMembers?.some(jury => jury.id === userId) ?? false;
    };

    // Managers can only specify time if they are jury members
    const canSpecifyTime = (meeting: Meeting): boolean => {
        if (role === UserRole.MANAGER) {
            return isJuryMember(meeting);
        }
        // Regular professors can specify time for any meeting they see
        return true;
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
            alert('As a manager, you can only specify time for meetings where you are a jury member.');
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
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">
                    {role === UserRole.MANAGER ? 'Department Meetings' : 'My Meetings'}
                </h1>
                {role === UserRole.MANAGER && (
                    <p className="text-gray-600 mt-2">
                        Viewing all meetings in your department. You can specify time slots for meetings where you are a jury member.
                    </p>
                )}
            </div>

            <MeetingView
                meetings={meetings || []}
                isLoading={isLoading}
                userRole="professor"
                onMeetingAction={handleMeetingAction}
                showActionButton={(meeting) => {
                    const canSpecify = canSpecifyTime(meeting);
                    return canSpecify && (
                        meeting.state === MeetingState.JURIES_SELECTED ||
                        meeting.state === MeetingState.JURIES_SPECIFIED_TIME
                    );
                }}
                actionButtonLabel={getActionButtonLabel}
                canViewTimeSlots={canViewTimeSlots}
                renderTimeSlotsComparison={(meeting) => (
                    <TimeSlotsComparison meetingId={meeting.id} />
                )}
                renderAdditionalContent={(meeting) => {
                    // Show info banner for managers when they can't specify time
                    if (role === UserRole.MANAGER && !isJuryMember(meeting)) {
                        return (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                                <p className="text-sm text-blue-800">
                                    <strong>Note:</strong> You are viewing this meeting as a department manager.
                                    You can only specify time slots for meetings where you are assigned as a jury member.
                                </p>
                            </div>
                        );
                    }
                    return null;
                }}
            />
        </div>
    );
};
