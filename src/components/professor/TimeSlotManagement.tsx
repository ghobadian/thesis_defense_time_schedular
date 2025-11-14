import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { professorAPI } from '../../api/professor.api';
import { Calendar, Clock } from 'lucide-react';
import { TimePeriod } from '../../types';

export const TimeSlotManagement: React.FC = () => {
    const queryClient = useQueryClient();
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedPeriods, setSelectedPeriods] = useState<TimePeriod[]>([]);

    const { data: timeSlots } = useQuery({
        queryKey: ['myTimeSlots'],
        queryFn: professorAPI.getMyTimeSlots,
    });

    const submitMutation = useMutation({
        mutationFn: professorAPI.submitTimeSlots,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['myTimeSlots'] });
            alert('Time slots submitted successfully!');
            setSelectedDate('');
            setSelectedPeriods([]);
        },
        onError: (error: any) => {
            alert(error.response?.data?.message || 'Failed to submit time slots');
        },
    });

    const togglePeriod = (period: TimePeriod) => {
        setSelectedPeriods(prev =>
            prev.includes(period)
                ? prev.filter(p => p !== period)
                : [...prev, period]
        );
    };

    const handleSubmit = () => {
        if (!selectedDate || selectedPeriods.length === 0) {
            alert('Please select a date and at least one time period');
            return;
        }

        submitMutation.mutate({
            date: selectedDate,
            periods: selectedPeriods,
        });
    };

    const periodLabels: Record<TimePeriod, string> = {
        [TimePeriod.PERIOD_7_30_9_00]: '7:30 - 9:00',
        [TimePeriod.PERIOD_9_00_10_30]: '9:00 - 10:30',
        [TimePeriod.PERIOD_10_30_12_00]: '10:30 - 12:00',
        [TimePeriod.PERIOD_13_30_15_00]: '13:30 - 15:00',
        [TimePeriod.PERIOD_15_30_17_00]: '15:30 - 17:00',
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Available Time Slots</h2>

            <Card title="Add New Time Slots">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Date
                        </label>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full border rounded-lg px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Time Periods
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            {Object.entries(periodLabels).map(([period, label]) => (
                                <button
                                    key={period}
                                    type="button"
                                    onClick={() => togglePeriod(period as TimePeriod)}
                                    className={`p-3 rounded-lg border-2 text-sm font-medium transition-colors ${
                                        selectedPeriods.includes(period as TimePeriod)
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
                        onClick={handleSubmit}
                        isLoading={submitMutation.isPending}
                        disabled={!selectedDate || selectedPeriods.length === 0}
                    >
                        Submit Time Slots
                    </Button>
                </div>
            </Card>

            <Card title="My Submitted Time Slots">
                {!timeSlots || timeSlots.length === 0 ? (
                    <p className="text-gray-500">No time slots submitted yet.</p>
                ) : (
                    <div className="space-y-3">
                        {timeSlots.map((slot: any) => (
                            <div key={slot.id} className="p-3 border rounded-lg">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            {new Date(slot.date).toLocaleDateString()}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {periodLabels[slot.period as TimePeriod]}
                                        </p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                        slot.isAvailable
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-gray-100 text-gray-800'
                                    }`}>
                                        {slot.isAvailable ? 'Available' : 'Booked'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Card>
        </div>
    );
};
