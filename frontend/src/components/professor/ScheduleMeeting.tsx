// src/components/professor/ScheduleMeeting.tsx
import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { professorAPI } from '../../api/professor.api';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { Calendar, Clock, MapPin, CheckCircle, AlertCircle } from 'lucide-react';
import { TimePeriod } from '../../types';
import { format, parseISO } from 'date-fns';

interface ScheduleMeetingProps {
    meetingId: number;
    onScheduled?: () => void;
}

export const ScheduleMeeting: React.FC<ScheduleMeetingProps> = ({ meetingId, onScheduled }) => {
    const queryClient = useQueryClient();
    const [location, setLocation] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const { data: meeting, isLoading: loadingMeeting } = useQuery({
        queryKey: ['meeting', meetingId],
        queryFn: () => professorAPI.getMeetingById(meetingId),
    });

    const scheduleMutation = useMutation({
        mutationFn: (data: { meetingId: number; location: string }) =>
            professorAPI.scheduleMeeting(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['myMeetings'] });
            queryClient.invalidateQueries({ queryKey: ['meeting', meetingId] });
            setSuccess(true);
            setError(null);
            setLocation('');

            // Call the onScheduled callback if provided
            if (onScheduled) {
                setTimeout(() => {
                    onScheduled();
                }, 1500);
            }
        },
        onError: (error: any) => {
            setError(error.response?.data?.message || 'Failed to schedule meeting');
            setSuccess(false);
        },
    });

    const handleSchedule = () => {
        if (!location.trim()) {
            setError('Please enter a location');
            return;
        }

        setError(null);

        if (window.confirm('Are you sure you want to schedule this meeting with the selected time slot?')) {
            scheduleMutation.mutate({
                meetingId,
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

            {/* Success Message */}
            {success && (
                <div className="flex items-start space-x-3 bg-green-50 border border-green-200 rounded-lg p-4">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-medium text-green-800">Meeting scheduled successfully!</p>
                        <p className="text-sm text-green-700 mt-1">
                            All participants will be notified about the scheduled meeting.
                        </p>
                    </div>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="flex items-start space-x-3 bg-red-50 border border-red-200 rounded-lg p-4">
                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-800">{error}</p>
                </div>
            )}

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
                        onChange={(e) => {
                            setLocation(e.target.value);
                            if (error) setError(null);
                        }}
                        placeholder="e.g., Room 305, Building A"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        disabled={scheduleMutation.isPending || success}
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
                    disabled={!location.trim() || scheduleMutation.isPending || success}
                    className="px-6"
                >
                    {success ? 'Scheduled!' : 'Confirm & Schedule Meeting'}
                </Button>
            </div>
        </div>
    );
};
