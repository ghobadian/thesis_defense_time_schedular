// src/components/student/TimeSlotSelection.tsx
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { studentAPI } from '../../api/student.api';
import { Calendar, Check, Clock } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { TimeSlot } from '../../types';

interface TimeSlotSelectionProps {
    meetingId: number;
}

export const TimeSlotSelection: React.FC<TimeSlotSelectionProps> = ({ meetingId }) => {
    const queryClient = useQueryClient();
    const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
    const [selectedDate, setSelectedDate] = useState<string>('');

    const { data: availableSlots, isLoading: loadingSlots } = useQuery({
        queryKey: ['availableTimeSlots', meetingId],
        queryFn: async () => {
            const meeting = await studentAPI.getMeetingDetails(meetingId);
            return meeting.availableTimeSlots || [];
        },
    });

    const selectSlotMutation = useMutation({
        mutationFn: ({ timeSlotId, meetingId }: { timeSlotId: number; meetingId: number }) =>
            studentAPI.chooseTimeSlot({ meetingId, timeSlotId }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['studentMeetings'] });
            queryClient.invalidateQueries({ queryKey: ['availableTimeSlots', meetingId] });
            alert('Time slot selected successfully!');
            setSelectedSlot(null);
        },
        onError: (error: any) => {
            alert(error.response?.data?.message || 'Failed to select time slot');
        },
    });

    const handleSelectSlot = (slotId: number) => {
        if (window.confirm('Are you sure you want to select this time slot for your defense meeting?')) {
            selectSlotMutation.mutate({ timeSlotId: slotId, meetingId });
        }
    };

    const groupedSlots = availableSlots?.reduce((acc: any, slot: TimeSlot) => {
        if (!acc[slot.date]) {
            acc[slot.date] = [];
        }
        acc[slot.date].push(slot);
        return acc;
    }, {}) || {};

    const formatPeriod = (period: string) => {
        const periods: { [key: string]: string } = {
            'PERIOD_7_30_9_00': '7:30 AM - 9:00 AM',
            'PERIOD_9_00_10_30': '9:00 AM - 10:30 AM',
            'PERIOD_10_30_12_00': '10:30 AM - 12:00 PM',
            'PERIOD_13_30_15_00': '1:30 PM - 3:00 PM',
            'PERIOD_15_30_17_00': '3:30 PM - 5:00 PM',
        };
        return periods[period] || period;
    };

    if (loadingSlots) {
        return (
            <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (Object.keys(groupedSlots).length === 0) {
        return (
            <Card className="bg-gray-50">
                <p className="text-gray-500 text-center py-8">
                    No common time slots available yet. Waiting for jury members to specify their availability.
                </p>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            <h4 className="text-lg font-semibold text-gray-900">Select Your Time Slot</h4>

            {/* Date Filter */}
            <div className="flex gap-2 flex-wrap">
                <Button
                    variant={selectedDate === '' ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => setSelectedDate('')}
                >
                    All Dates
                </Button>
                {Object.keys(groupedSlots).map((date) => (
                    <Button
                        key={date}
                        variant={selectedDate === date ? 'primary' : 'secondary'}
                        size="sm"
                        onClick={() => setSelectedDate(date)}
                    >
                        {format(parseISO(date), 'MMM d')}
                    </Button>
                ))}
            </div>

            {/* Time Slots Grid */}
            <div className="space-y-4">
                {Object.entries(groupedSlots)
                    .filter(([date]) => !selectedDate || date === selectedDate)
                    .map(([date, slots]) => (
                        <div key={date} className="border rounded-lg p-4">
                            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-primary-600" />
                                {format(parseISO(date), 'EEEE, MMMM d, yyyy')}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {(slots as TimeSlot[]).map((slot: TimeSlot) => (
                                    <div
                                        key={slot.id}
                                        className={`p-3 border rounded-lg border-gray-200 hover:border-primary-500 cursor-pointer ${
                                            selectedSlot === slot.id ? 'border-primary-500 bg-primary-50' : ''
                                        }`}
                                        onClick={() => setSelectedSlot(slot.id)}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="text-sm font-medium text-gray-900">Time Slot</div>
                                            <Check className="w-4 h-4 text-green-600" />
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {formatPeriod(slot.timePeriod)}
                                            </div>
                                        </div>
                                        {selectedSlot === slot.id && (
                                            <Button
                                                size="sm"
                                                className="w-full mt-3"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleSelectSlot(slot.id);
                                                }}
                                                isLoading={selectSlotMutation.isPending}
                                            >
                                                Confirm Selection
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
};
