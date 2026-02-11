// components/professor/TimeSlotsComparison.tsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Calendar, Clock, Users, CheckCircle } from 'lucide-react';
import { Card } from '../common/Card';
import { TimeSlot, TimePeriod, ProfessorTimeSlots } from '../../types';
import { professorAPI } from '../../api/professor.api';

const periodLabels: Record<TimePeriod, string> = {
    [TimePeriod.PERIOD_7_30_9_00]: '7:30 - 9:00',
    [TimePeriod.PERIOD_9_00_10_30]: '9:00 - 10:30',
    [TimePeriod.PERIOD_10_30_12_00]: '10:30 - 12:00',
    [TimePeriod.PERIOD_13_30_15_00]: '13:30 - 15:00',
    [TimePeriod.PERIOD_15_30_17_00]: '15:30 - 17:00',
};

export const TimeSlotsComparison = ({ meetingId }: { meetingId: number }) => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['meetingTimeSlots', meetingId],
        queryFn: () => professorAPI.getMeetingTimeSlots(meetingId),
    });

    // Group time slots by date for each professor
    const groupSlotsByDate = (slots: TimeSlot[]) => {
        if (!slots || !Array.isArray(slots)) return {};

        return slots.reduce((acc, slot) => {
            if (!acc[slot.date]) {
                acc[slot.date] = [];
            }
            acc[slot.date].push(slot.timePeriod);
            return acc;
        }, {} as Record<string, TimePeriod[]>);
    };

    // Check if a specific slot is in the intersection
    const isIntersection = (date: string, period: TimePeriod) => {
        if (!data?.intersections || !Array.isArray(data.intersections)) return false;

        return data.intersections.some(
            slot => slot.date === date && slot.timePeriod === period
        );
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-8">
                <div className="text-gray-600">Loading time slots...</div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm">
                    Failed to load time slots. Please try again.
                </p>
            </div>
        );
    }

    // No data state
    if (!data) {
        return null;
    }

    const { juryMemberTimeSlots, intersections } = data;

    // Add null/undefined check
    if (!juryMemberTimeSlots || !Array.isArray(juryMemberTimeSlots)) {
        return (
            <Card className="bg-gray-50">
                <p className="text-gray-600 text-center py-8">
                    No jury member data available.
                </p>
            </Card>
        );
    }

    // Get all unique dates from all professors
    const allDates = new Set<string>();
    juryMemberTimeSlots.forEach((professor: ProfessorTimeSlots) => {
        if (professor?.timeslots && Array.isArray(professor.timeslots)) {
            professor.timeslots.forEach((slot: TimeSlot) => {
                if (slot?.date) {
                    allDates.add(slot.date);
                }
            });
        }
    });
    const sortedDates = Array.from(allDates).sort();

    return (
        <div className="space-y-6">
            {/* Intersection Summary */}
            {intersections && intersections.length > 0 ? (
                <Card className="bg-green-50 border-green-200">
                    <div className="flex items-start space-x-3">
                        <CheckCircle className="h-6 w-6 text-green-600 mt-1" />
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-green-900 mb-2">
                                Common Available Times Found
                            </h3>
                            <p className="text-sm text-green-700 mb-3">
                                {intersections.length} time slot(s) available for all jury members
                            </p>
                            <div className="space-y-2">
                                {Object.entries(groupSlotsByDate(intersections))
                                    .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
                                    .map(([date, periods]) => (
                                        <div key={date} className="bg-white rounded-lg p-3 border border-green-200">
                                            <p className="font-medium text-gray-900 mb-2">
                                                {new Date(date).toLocaleDateString('en-US', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {periods.map(period => (
                                                    <span
                                                        key={period}
                                                        className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                                                    >
                                                        {periodLabels[period]}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                </Card>
            ) : (
                <Card className="bg-yellow-50 border-yellow-200">
                    <div className="flex items-start space-x-3">
                        <Clock className="h-6 w-6 text-yellow-600 mt-1" />
                        <div>
                            <h3 className="text-lg font-semibold text-yellow-900 mb-1">
                                No Common Time Slots
                            </h3>
                            <p className="text-sm text-yellow-700">
                                {juryMemberTimeSlots.filter(p => p?.timeslots && p.timeslots.length > 0).length} of {juryMemberTimeSlots.length} jury members have submitted their availability.
                                Waiting for others or no overlapping times available.
                            </p>
                        </div>
                    </div>
                </Card>
            )}

            {/* Individual Professor Time Slots */}
            <Card>
                <div className="flex items-center space-x-2 mb-4">
                    <Users className="h-5 w-5 text-gray-600" />
                    <h3 className="text-lg font-semibold text-gray-900">
                        Individual Availability by Jury Member
                    </h3>
                </div>

                <div className="space-y-4">
                    {juryMemberTimeSlots.map((timeslots: ProfessorTimeSlots) => {
                        if (!timeslots || !timeslots.user) return null;

                        const groupedSlots = groupSlotsByDate(timeslots.timeslots || []);

                        return (
                            <div key={timeslots.user.id} className="border rounded-lg p-4 bg-gray-50">
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="font-medium text-gray-900">
                                        {timeslots.user.firstName} {timeslots.user.lastName}
                                    </h4>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                        timeslots.timeslots && timeslots.timeslots.length > 0
                                            ? 'bg-blue-100 text-blue-800'
                                            : 'bg-gray-100 text-gray-600'
                                    }`}>
                                        {timeslots.timeslots && timeslots.timeslots.length > 0
                                            ? `${timeslots.timeslots.length} slots provided`
                                            : 'Awaiting response'}
                                    </span>
                                </div>

                                {!timeslots.timeslots || timeslots.timeslots.length === 0 ? (
                                    <p className="text-sm text-gray-500 italic">
                                        No time slots submitted yet
                                    </p>
                                ) : (
                                    <div className="space-y-2">
                                        {Object.entries(groupedSlots)
                                            .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
                                            .map(([date, periods]) => (
                                                <div key={date} className="bg-white rounded p-3 border">
                                                    <p className="text-sm font-medium text-gray-700 mb-2">
                                                        {new Date(date).toLocaleDateString('en-US', {
                                                            weekday: 'short',
                                                            month: 'short',
                                                            day: 'numeric',
                                                            year: 'numeric'
                                                        })}
                                                    </p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {periods.map(period => (
                                                            <span
                                                                key={period}
                                                                className={`px-2 py-1 rounded text-xs font-medium ${
                                                                    isIntersection(date, period)
                                                                        ? 'bg-green-100 text-green-800 ring-2 ring-green-400'
                                                                        : 'bg-gray-100 text-gray-700'
                                                                }`}
                                                            >
                                                                {periodLabels[period]}
                                                                {isIntersection(date, period) && ' ✓'}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </Card>

            {/* Date-based Matrix View (Alternative visualization) */}
            {sortedDates.length > 0 && (
                <Card>
                    <div className="flex items-center space-x-2 mb-4">
                        <Calendar className="h-5 w-5 text-gray-600" />
                        <h3 className="text-lg font-semibold text-gray-900">
                            Availability Matrix
                        </h3>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date / Time
                                </th>
                                {Object.values(periodLabels).map(label => (
                                    <th key={label} className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {label}
                                    </th>
                                ))}
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {sortedDates.map(date => (
                                <tr key={date}>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {new Date(date).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </td>
                                    {Object.keys(periodLabels).map(period => {
                                        const availableProfessors = juryMemberTimeSlots.filter(prof =>
                                                prof?.timeslots && prof.timeslots.some(slot =>
                                                    slot && slot.date === date && slot.timePeriod === period
                                                )
                                        );
                                        const isCommon = isIntersection(date, period as TimePeriod);

                                        return (
                                            <td key={period} className="px-4 py-3 text-center">
                                                {availableProfessors.length > 0 ? (
                                                    <div className={`inline-flex items-center justify-center px-2 py-1 rounded text-xs font-medium ${
                                                        isCommon
                                                            ? 'bg-green-100 text-green-800 ring-2 ring-green-400'
                                                            : 'bg-blue-100 text-blue-800'
                                                    }`}>
                                                        {availableProfessors.length}/{juryMemberTimeSlots.length}
                                                        {isCommon && ' ✓'}
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-300">-</span>
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-4 flex items-center space-x-4 text-xs text-gray-600">
                        <div className="flex items-center space-x-1">
                            <div className="w-4 h-4 bg-green-100 border-2 border-green-400 rounded"></div>
                            <span>All available</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <div className="w-4 h-4 bg-blue-100 rounded"></div>
                            <span>Partially available</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <div className="w-4 h-4 bg-gray-100 rounded"></div>
                            <span>Not available</span>
                        </div>
                    </div>
                </Card>
            )}
        </div>
    );
};
