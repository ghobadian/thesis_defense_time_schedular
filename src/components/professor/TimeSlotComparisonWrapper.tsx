// components/professor/TimeSlotComparisonWrapper.tsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { professorAPI } from '../../api/professor.api';
import { TimeSlotsComparison } from './TimeSlotsComparison';

interface TimeSlotComparisonWrapperProps {
    meetingId: number;
}

export const TimeSlotComparisonWrapper: React.FC<TimeSlotComparisonWrapperProps> = ({ meetingId }) => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['meetingTimeSlots', meetingId],
        queryFn: () => professorAPI.getMeetingTimeSlots(meetingId),
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-8">
                <div className="text-gray-600">Loading time slots...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm">
                    Failed to load time slots. Please try again.
                </p>
            </div>
        );
    }

    if (!data) {
        return null;
    }

    return (
        <TimeSlotsComparison
            juryMemberTimeSlots={data.juryMemberTimeSlots}
            intersections={data.intersections}
        />
    );
};
