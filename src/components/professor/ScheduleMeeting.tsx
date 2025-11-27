// src/components/professor/ScheduleMeeting.tsx
import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { professorAPI } from '../../api/professor.api';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { TimePeriod } from '../../types';
import { format, parseISO } from 'date-fns';

interface ScheduleMeetingProps {
    meetingId: number;
}

export const ScheduleMeeting: React.FC<ScheduleMeetingProps> = ({ meetingId }) => {
    const queryClient = useQueryClient();
    const [location, setLocation] = useState('');

    const { data: meeting, isLoading: loadingMeeting } = useQuery({
        queryKey: ['meeting', meetingId],
        queryFn: () => professorAPI.getMeetingById(meetingId),
    });

    const scheduleMutation = useMutation({
        mutationFn: (data: { meetingId: number; timeSlotId: number; location: string }) =>
            professorAPI.scheduleMeeting(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['myMeetings'] });
            queryClient.invalidateQueries({ queryKey: ['meeting', meetingId] });
            alert('Meeting scheduled successfully!');
            setLocation('');
        },
        onError: (error: any) => {
            alert(error.response?.data?.message || 'Failed to schedule meeting');
        },
    });

    const handleSchedule = () => {
        if (!location.trim()) {
            alert('Please enter a location');
            return;
        }

        if (window.confirm('Are you sure you want to schedule this meeting?')) {
            scheduleMutation.mutate({
                meetingId,
                timeSlotId: studentSelectedSlot.id,
                location: location.trim(),
            });
        }
    };

    const formatPeriod = (period: TimePeriod): string => {
        const periodMap: Record<TimePeriod, string> = {
            [TimePeriod.PERIOD_7_30_9_00]: '7:30 AM - 9:00 AM',
            [TimePeriod.PERIOD_9_00_10_30]: '9:00 AM - 10:30 AM',
            [TimePeriod.PERIOD_10_30_12_00]: '10:30 AM - 12:00 PM',
            [TimePeriod.PERIOD_13_30_15_00]: '1:30 PM - 3:00 PM',
            [TimePeriod.PERIOD_15_30_17_00]: '3:30 PM - 5:00 PM',
        };
        return periodMap[period] || period;
    };

    if (loadingMeeting) {
        return (
            <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    const studentSelectedSlot = meeting?.selectedTimeSlot;

    if (!studentSelectedSlot) {
        return (
            <Card className="bg-yellow-50 border-yellow-200">
                <p className="text-yellow-800 text-center py-4">
                    Student has not selected a time slot yet.
                </p>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            <h4 className="text-lg font-semibold text-gray-900">Schedule Meeting</h4>

            {/* Student's Selected Time Slot */}
            <Card className="bg-blue-50 border-blue-200">
                <h5 className="font-semibold text-gray-900 mb-3">Student's Selected Time Slot</h5>
                <div className="space-y-2">
                    <div className="flex items-center text-gray-700">
                        <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                        <span>{format(parseISO(studentSelectedSlot.date), 'EEEE, MMMM d, yyyy')}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                        <Clock className="w-5 h-5 mr-2 text-blue-600" />
                        <span>{formatPeriod(studentSelectedSlot.timePeriod)}</span>
                    </div>
                </div>
            </Card>

            {/* Location Input */}
            <Card>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <MapPin className="inline h-4 w-4 mr-1" />
                        Meeting Location *
                    </label>
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g., Room 305, Building A"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Specify where the defense meeting will take place
                    </p>
                </div>
            </Card>

            {/* Schedule Button */}
            <div className="flex justify-end space-x-3">
                <Button
                    onClick={handleSchedule}
                    isLoading={scheduleMutation.isPending}
                    disabled={!location.trim() || scheduleMutation.isPending}
                    className="px-6"
                >
                    Confirm Schedule
                </Button>
            </div>
        </div>
    );
};
