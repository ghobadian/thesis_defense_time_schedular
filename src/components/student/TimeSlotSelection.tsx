// src/components/student/TimeSlotSelection.tsx
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { studentAPI } from '../../api/student.api';
import { Calendar, Clock, Check, X, AlertCircle, Users } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import {Meeting} from "../../types";

interface TimeSlot {
    id: number;
    professorId: number;
    professorName: string;
    date: string;
    startTime: string;
    endTime: string;
    isAvailable: boolean;
    period: string;
    meetingId?: number; // Associated meeting if any
}

interface PendingMeeting {
    id: number;
    thesisFormId: number;
    thesisTitle: string;
    status: string;
    juryMembers: Array<{
        id: number;
        name: string;
        role: string;
    }>;
    timeSlots: TimeSlot[];
}

export const TimeSlotSelection: React.FC = () => {
    const queryClient = useQueryClient();
    const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
    const [selectedMeeting, setSelectedMeeting] = useState<number | null>(null);
    const [selectedDate, setSelectedDate] = useState<string>('');

    // Fetch meetings that need time slot selection
    const { data: pendingMeetings, isLoading: loadingMeetings } = useQuery({
        queryKey: ['pendingMeetings'],
        queryFn: async () => {
            const meetings = await studentAPI.getMeetings();
            // Filter meetings that need time slot selection
            return meetings.filter((m: Meeting) =>
                m.state === 'JURY_SELECTION' ||
                m.state === 'TIME_SELECTION'
            );
        },
    });

    // Fetch confirmed meetings
    const { data: confirmedMeetings } = useQuery({
        queryKey: ['confirmedMeetings'],
        queryFn: async () => {
            const meetings = await studentAPI.getMeetings();
            return meetings.filter((m: any) => m.status === 'CONFIRMED');
        },
    });

    // Get available time slots for selected meeting
    const { data: availableSlots, isLoading: loadingSlots } = useQuery({
        queryKey: ['availableTimeSlots', selectedMeeting],
        queryFn: async () => {
            if (!selectedMeeting) return [];
            const meeting = await studentAPI.getMeetingDetails(selectedMeeting);
            return meeting.availableTimeSlots || [];
        },
        enabled: !!selectedMeeting,
    });

    // Mutation for selecting a time slot
    const selectSlotMutation = useMutation({
        mutationFn: ({ timeSlotId, meetingId }: { timeSlotId: number; meetingId: number }) =>
            studentAPI.chooseTimeSlot({
                timeSlotId,
                meetingId
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pendingMeetings'] });
            queryClient.invalidateQueries({ queryKey: ['confirmedMeetings'] });
            queryClient.invalidateQueries({ queryKey: ['availableTimeSlots'] });
            alert('Time slot selected successfully!');
            setSelectedSlot(null);
            setSelectedMeeting(null);
        },
        onError: (error: any) => {
            alert(error.response?.data?.message || 'Failed to select time slot');
        },
    });

    const handleSelectSlot = (slotId: number, meetingId: number) => {
        if (window.confirm('Are you sure you want to select this time slot for your defense meeting?')) {
            selectSlotMutation.mutate({ timeSlotId: slotId, meetingId });
        }
    };

    // Group slots by date
    const groupedSlots = availableSlots?.reduce((acc: any, slot: TimeSlot) => {
        const date = slot.date;
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(slot);
        return acc;
    }, {}) || {};

    const formatPeriod = (period: string) => {
        const periods: { [key: string]: string } = {
            'MORNING': '08:00 - 09:30',
            'MID_MORNING': '09:30 - 11:00',
            'NOON': '11:00 - 12:30',
            'AFTERNOON': '14:00 - 15:30',
            'LATE_AFTERNOON': '15:30 - 17:00',
            'EVENING': '17:00 - 18:30',
        };
        return periods[period] || period;
    };

    if (loadingMeetings) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Time Slot Selection</h2>

            {/* Confirmed Meetings */}
            {confirmedMeetings && confirmedMeetings.length > 0 && (
                <Card title="Confirmed Defense Meetings">
                    <div className="space-y-3">
                        {confirmedMeetings.map((meeting: any) => (
                            <div
                                key={meeting.id}
                                className="p-4 border border-gray-200 rounded-lg bg-green-50"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-semibold text-gray-900">
                                            {meeting.thesisTitle}
                                        </h4>
                                        <div className="mt-2 space-y-1 text-sm text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4" />
                                                {meeting.date && format(parseISO(meeting.date), 'EEEE, MMMM d, yyyy')}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4" />
                                                {meeting.startTime} - {meeting.endTime}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Users className="w-4 h-4" />
                                                Jury: {meeting.juryMembers?.map((j: any) => j.name).join(', ')}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="px-3 py-1 bg-green-600 text-white rounded-full text-xs">
                                        Confirmed
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            )}

            {/* Pending Meetings - Need Time Selection */}
            {pendingMeetings && pendingMeetings.length > 0 ? (
                <Card title="Meetings Awaiting Time Selection">
                    <div className="space-y-4">
                        {pendingMeetings.map((meeting: PendingMeeting) => (
                            <div
                                key={meeting.id}
                                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                                    selectedMeeting === meeting.id
                                        ? 'border-primary-500 bg-primary-50'
                                        : 'border-gray-200 hover:border-primary-300'
                                }`}
                                onClick={() => setSelectedMeeting(meeting.id)}
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-semibold text-gray-900">
                                            {meeting.thesisTitle}
                                        </h4>
                                        <div className="mt-2 text-sm text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <Users className="w-4 h-4" />
                                                Jury Members: {meeting.juryMembers?.map(j => j.name).join(', ')}
                                            </div>
                                        </div>
                                    </div>
                                    {selectedMeeting === meeting.id ? (
                                        <Check className="w-5 h-5 text-primary-600" />
                                    ) : (
                                        <span className="text-sm text-gray-500">Click to select</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            ) : (
                <Card>
                    <div className="text-center py-8">
                        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No meetings require time slot selection at this moment.</p>
                    </div>
                </Card>
            )}

            {/* Available Time Slots for Selected Meeting */}
            {selectedMeeting && (
                <Card title="Available Time Slots">
                    {loadingSlots ? (
                        <div className="flex justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                        </div>
                    ) : Object.keys(groupedSlots).length === 0 ? (
                        <p className="text-gray-500 text-center py-8">
                            No common time slots available for the selected meeting.
                        </p>
                    ) : (
                        <div className="space-y-6">
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
                                                {(slots as TimeSlot[]).map((slot) => (
                                                    <div
                                                        key={slot.id}
                                                        className={`p-3 border rounded-lg ${
                                                            slot.isAvailable
                                                                ? 'border-gray-200 hover:border-primary-500 cursor-pointer'
                                                                : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-50'
                                                        } ${
                                                            selectedSlot === slot.id
                                                                ? 'border-primary-500 bg-primary-50'
                                                                : ''
                                                        }`}
                                                        onClick={() => {
                                                            if (slot.isAvailable) {
                                                                setSelectedSlot(slot.id);
                                                            }
                                                        }}
                                                    >
                                                        <div className="flex justify-between items-start mb-2">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                Time Slot
                                                            </div>
                                                            {slot.isAvailable ? (
                                                                <Check className="w-4 h-4 text-green-600" />
                                                            ) : (
                                                                <X className="w-4 h-4 text-red-600" />
                                                            )}
                                                        </div>
                                                        <div className="text-sm text-gray-600">
                                                            <div className="flex items-center gap-1">
                                                                <Clock className="w-3 h-3" />
                                                                {formatPeriod(slot.period)}
                                                            </div>
                                                        </div>
                                                        {slot.isAvailable && selectedSlot === slot.id && (
                                                            <Button
                                                                size="sm"
                                                                className="w-full mt-3"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleSelectSlot(slot.id, selectedMeeting);
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
                    )}
                </Card>
            )}
        </div>
    );
};
