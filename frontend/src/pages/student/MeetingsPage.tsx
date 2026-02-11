// MeetingsPage.tsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { studentAPI } from '../../api/student.api';
import { MeetingView } from '../../components/common/MeetingView';
import { TimeSlotSelection } from '../../components/student/TimeSlotSelection';
import { Meeting, MeetingState } from '../../types';

export const MeetingsPage: React.FC = () => {
    const { data: meetings, isLoading, error } = useQuery({
        queryKey: ['studentMeetings'],
        queryFn: studentAPI.getMeetings,
    });

    const canSelectTime = (meeting: Meeting): boolean => {
        return meeting.state === MeetingState.JURIES_SPECIFIED_TIME;
    };

    const getActionButtonLabel = (meeting: Meeting): string | null => {
        if (canSelectTime(meeting)) {
            return 'Select Time Slot';
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
                <h1 className="text-3xl font-bold text-gray-900">My Defense Meetings</h1>
                <p className="text-gray-600 mt-2">
                    View your thesis defense meetings and select available time slots
                </p>
            </div>

            <MeetingView
                meetings={meetings || []}
                isLoading={isLoading}
                userRole="student"
                showActionButton={canSelectTime}
                actionButtonLabel={getActionButtonLabel}
                renderAdditionalContent={(meeting) => {
                    if (canSelectTime(meeting)) {
                        return <TimeSlotSelection meetingId={meeting.id} />;
                    }
                    return null;
                }}
            />
        </div>
    );
};
