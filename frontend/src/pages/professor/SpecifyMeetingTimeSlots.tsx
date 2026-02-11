// professor/SpecifyMeetingTimeSlots.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { TimeSlotsComparison } from '../../components/professor/TimeSlotsComparison';
import { professorAPI } from '../../api/professor.api';
import { Calendar, Clock, ArrowLeft, Users } from 'lucide-react';
import { TimePeriod, TimeSlot } from '../../types';
import { useAuthStore } from '../../store/authStore';

export const SpecifyMeetingTimeSlots: React.FC = () => {
    const { meetingId } = useParams<{ meetingId: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { userId } = useAuthStore();

    const [selectedSlots, setSelectedSlots] = useState<TimeSlot[]>([]);
    const [currentDate, setCurrentDate] = useState('');
    // const [currentSlots, setCurrentSlots] = useState<TimeSlot[]>([]);
    const [currentPeriods, setCurrentPeriods] = useState<TimePeriod[]>([]);

    // Fetch meeting details
    const { data: meeting, isLoading } = useQuery({
        queryKey: ['meeting', meetingId],
        queryFn: () => professorAPI.getMeetingById(Number(meetingId)),
    });

    // Fetch ONLY current professor's time slots for this meeting
    const { data: myExistingTimeSlots, isLoading: isLoadingTimeSlots } = useQuery({
        queryKey: ['myMeetingTimeSlots', meetingId, userId],
        queryFn: () => professorAPI.getMyMeetingTimeSlots(Number(meetingId)),
        enabled: !!meetingId && !!userId,
    });

    // Populate selectedSlots when existing time slots are loaded
    useEffect(() => {
        if (myExistingTimeSlots && Array.isArray(myExistingTimeSlots)) {
            const formattedSlots: TimeSlot[] = myExistingTimeSlots.map((slot: TimeSlot) => ({
                id: slot.id,
                date: slot.date,
                timePeriod: slot.timePeriod,
            }));
            setSelectedSlots(formattedSlots);
        }
    }, [myExistingTimeSlots]);

    // Submit time slots mutation
    const submitMutation = useMutation({
        mutationFn: (availableTime: { meetingId: number; timeSlots: TimeSlot[] }) =>
            professorAPI.submitMeetingTimeSlots(availableTime),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['myMeetings'] });
            queryClient.invalidateQueries({ queryKey: ['meeting', meetingId] });
            queryClient.invalidateQueries({ queryKey: ['myMeetingTimeSlots', meetingId, userId] });
            queryClient.invalidateQueries({ queryKey: ['myTimeSlots'] });
            queryClient.invalidateQueries({ queryKey: ['meetingTimeSlots', Number(meetingId)] });
            alert('Time slots updated successfully!');
            navigate(`/professor/meetings/${meetingId}/specify-time`);
        },
        onError: (error: any) => {
            alert(error.response?.data?.message || 'Failed to submit time slots');
        },
    });

    const periodLabels: Record<TimePeriod, string> = {
        [TimePeriod.PERIOD_7_30_9_00]: '7:30 - 9:00',
        [TimePeriod.PERIOD_9_00_10_30]: '9:00 - 10:30',
        [TimePeriod.PERIOD_10_30_12_00]: '10:30 - 12:00',
        [TimePeriod.PERIOD_13_30_15_00]: '13:30 - 15:00',
        [TimePeriod.PERIOD_15_30_17_00]: '15:30 - 17:00',
    };

    // const togglePeriod = (slot: TimeSlot) => {
    //     setCurrentSlots(prev =>
    //         prev.includes(slot)
    //             ? prev.filter(p => p !== slot)
    //             : [...prev, slot]
    //     );
    // };

    const togglePeriod = (period: TimePeriod) => {
        setCurrentPeriods(prev =>
            prev.includes(period)
                ? prev.filter(p => p !== period)
                : [...prev, period]
        );
    };

    // const addTimeSlot = () => {
    //     if (!currentDate || currentSlots.length === 0) {
    //         alert('Please select a date and at least one time period');
    //         return;
    //     }
    //
    //     const newTimeSlots: TimeSlot[] = currentSlots.map(slot => ({
    //         id: slot.id,
    //         date: currentDate,
    //         timePeriod: slot.timePeriod,
    //     }));
    //
    //     setSelectedSlots(prev => {
    //         const existing = prev.filter(
    //             slot => !(slot.date === currentDate && currentSlots.includes(slot))
    //         );
    //         return [...existing, ...newTimeSlots];
    //     });
    //
    //     setCurrentDate('');
    //     setCurrentSlots([]);
    // };

    const addTimeSlot = () => {
        if (!currentDate || currentPeriods.length === 0) {
            alert('Please select a date and at least one time period');
            return;
        }

        const newTimeSlots: TimeSlot[] = currentPeriods.map(period => ({
            id: -1, // Temporary ID; real ID assigned by backend
            date: currentDate,
            timePeriod: period,
        }));

        setSelectedSlots(prev => {
            const existing = prev.filter(
                slot => !(slot.date === currentDate && currentPeriods.includes(slot.timePeriod))
            );
            return [...existing, ...newTimeSlots];
        });

        setCurrentDate('');
        setCurrentPeriods([]);
    };

    const removeTimeSlot = (date: string, period?: TimePeriod) => {
        if (period) {
            setSelectedSlots(prev =>
                prev.filter(slot => !(slot.date === date && slot.timePeriod === period))
            );
        } else {
            setSelectedSlots(prev => prev.filter(slot => slot.date !== date));
        }
    };

    const handleSubmit = () => {
        if (selectedSlots.length === 0) {
            alert('Please add at least one time slot');
            return;
        }

        submitMutation.mutate({
            meetingId: Number(meetingId),
            timeSlots: selectedSlots,
        });
    };

    const groupedSlots = selectedSlots.reduce((acc, slot) => {
        if (!acc[slot.date]) {
            acc[slot.date] = [];
        }
        acc[slot.date].push(slot.timePeriod);
        return acc;
    }, {} as Record<string, TimePeriod[]>);

    if (isLoading || isLoadingTimeSlots) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-600">Loading...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center space-x-4">
                <button
                    onClick={() => navigate('/professor/meetings')}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <ArrowLeft className="h-5 w-5 text-gray-600" />
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        {myExistingTimeSlots && myExistingTimeSlots.length > 0
                            ? 'Update My Available Time Slots'
                            : 'Specify My Available Time Slots'}
                    </h1>
                    {meeting && (
                        <p className="text-gray-600 mt-1">
                            For: {meeting.thesis.title} - {meeting.thesis.studentFirstName} {meeting.thesis.studentLastName}
                        </p>
                    )}
                </div>
            </div>

            {/* TIME SLOTS COMPARISON - NEW SECTION */}
            <Card className="bg-blue-50 border-blue-200">
                <div className="flex items-start space-x-3 mb-4">
                    <Users className="h-6 w-6 text-blue-600 mt-1" />
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                            Other Jury Members' Availability
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                            See what time slots other jury members have already submitted to help coordinate your selection
                        </p>
                    </div>
                </div>
                <TimeSlotsComparison meetingId={Number(meetingId)} />
            </Card>

            {/* Divider */}
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-gray-50 text-gray-500 font-medium">
                        Specify Your Availability Below
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Add Time Slot Form */}
                <Card title="Add Available Time Slots">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Calendar className="inline h-4 w-4 mr-1" />
                                Select Date
                            </label>
                            <input
                                type="date"
                                value={currentDate}
                                onChange={(e) => setCurrentDate(e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Clock className="inline h-4 w-4 mr-1" />
                                Select Time Periods
                            </label>
                            <div className="grid grid-cols-1 gap-2">
                                {Object.entries(periodLabels).map(([period, label]) => (
                                    <button
                                        key={period}
                                        type="button"
                                        onClick={() => togglePeriod(period as TimePeriod)}
                                        className={`p-3 rounded-lg border-2 text-sm font-medium transition-colors text-left ${
                                            currentPeriods.includes(period as TimePeriod)
                                                ? 'border-primary-600 bg-primary-50 text-primary-700'
                                                : 'border-gray-300 hover:border-gray-400'
                                        }`}
                                    >
                                        <Clock className="h-4 w-4 inline mr-2" />
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <Button
                            onClick={addTimeSlot}
                            disabled={!currentDate || currentPeriods.length === 0}
                            variant="secondary"
                            className="w-full"
                        >
                            Add to List
                        </Button>
                    </div>
                </Card>

                {/* Selected Time Slots */}
                <Card title={`Selected Time Slots (${Object.keys(groupedSlots).length} dates)`}>
                    {Object.keys(groupedSlots).length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <Clock className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                            <p>No time slots added yet</p>
                            <p className="text-sm mt-1">Add available dates and times from the form</p>
                        </div>
                    ) : (
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                            {Object.entries(groupedSlots)
                                .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
                                .map(([date, periods]) => (
                                    <div key={date} className="border rounded-lg p-3 bg-gray-50">
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="font-medium text-gray-900">
                                                {new Date(date).toLocaleDateString('en-US', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                            <button
                                                onClick={() => removeTimeSlot(date)}
                                                className="text-red-600 hover:text-red-800 text-sm"
                                            >
                                                Remove All
                                            </button>
                                        </div>
                                        <div className="space-y-1">
                                            {periods.map((period) => (
                                                <div
                                                    key={period}
                                                    className="flex items-center justify-between bg-white rounded px-3 py-2"
                                                >
                                                    <span className="text-sm text-gray-700">
                                                        {periodLabels[period]}
                                                    </span>
                                                    <button
                                                        onClick={() => removeTimeSlot(date, period)}
                                                        className="text-red-600 hover:text-red-800 text-xs"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                        </div>
                    )}
                </Card>
            </div>

            {/* Submit Button */}
            <Card>
                <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                        <p>Total slots selected: <span className="font-semibold">{selectedSlots.length}</span></p>
                        <p className="text-xs text-gray-500 mt-1">
                            Students will be able to choose from these available time slots
                        </p>
                    </div>
                    <div className="flex space-x-3">
                        <Button
                            variant="secondary"
                            onClick={() => navigate('/professor/meetings')}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            isLoading={submitMutation.isPending}
                            disabled={selectedSlots.length === 0}
                        >
                            Submit Time Slots
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};
