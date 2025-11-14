import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { professorAPI } from '../../api/professor.api';
import { Card } from '../../components/common/Card';
import { Calendar, Clock, Users, MapPin, CheckCircle, AlertCircle, XCircle, ChevronUp, ChevronDown } from 'lucide-react';
import {MeetingState, Meeting} from "../../types";
import {TimeSlotComparisonWrapper} from "../../components/professor/TimeSlotComparisonWrapper";
import {useAuthStore} from "../../store/authStore";

export const MyMeetings: React.FC = () => {
    const [selectedTab, setSelectedTab] = useState<'upcoming' | 'pending' | 'past'>('upcoming');
    const [expandedMeetings, setExpandedMeetings] = useState<Set<number>>(new Set());

    const { data: meetings, isLoading, error } = useQuery<Meeting[]>({
        queryKey: ['myMeetings'],
        queryFn: professorAPI.getMeetings,
    });

    const { data: timeSlots } = useQuery({
        queryKey: ['myTimeSlots'],
        queryFn: professorAPI.getMyTimeSlots,
    });

    const { userId } = useAuthStore();
    const currentProfessorId = userId;

    const getMeetingStateIcon = (state: MeetingState) => {
        switch (state) {
            case 'SCHEDULED':
                return <CheckCircle className="h-5 w-5 text-green-500" />;
            case 'JURY_SELECTION':
            case 'TIME_SELECTION':
                return <Clock className="h-5 w-5 text-yellow-500" />;
            case 'COMPLETED':
                return <CheckCircle className="h-5 w-5 text-blue-500" />;
            case 'CANCELED':
                return <XCircle className="h-5 w-5 text-red-500" />;
            default:
                return <AlertCircle className="h-5 w-5 text-gray-500" />;
        }
    };

    const getMeetingStateBadge = (state: MeetingState) => {
        const styles = {
            JURY_SELECTION: 'bg-yellow-100 text-yellow-800',
            TIME_SELECTION: 'bg-orange-100 text-orange-800',
            SCHEDULED: 'bg-green-100 text-green-800',
            COMPLETED: 'bg-blue-100 text-blue-800',
            CANCELLED: 'bg-red-100 text-red-800',
        };

        return (
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[state as keyof typeof styles] || 'bg-gray-100 text-gray-800'}`}>
                {state.replace(/_/g, ' ')}
            </span>
        );
    };

    const filterMeetings = (meetings: Meeting[] | undefined) => {
        if (!meetings) return [];

        const now = new Date();

        switch (selectedTab) {
            case 'upcoming':
                return meetings.filter((m: Meeting) =>
                    m.state === 'SCHEDULED' &&
                    m.selectedTimeSlot?.date &&
                    new Date(m.selectedTimeSlot?.date) >= now
                );
            case 'pending':
                return meetings.filter(m =>
                    m.state === 'JURY_SELECTION' || m.state === 'TIME_SELECTION'
                );
            case 'past':
                return meetings.filter(m =>
                    m.state === 'COMPLETED' ||
                    (m.state === 'SCHEDULED' && m.selectedTimeSlot?.date && new Date(m.selectedTimeSlot?.date) < now) ||
                    m.state === 'CANCELED'
                );
            default:
                return meetings;
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-600">Loading meetings...</div>
            </div>
        );
    }

    if (error) {
        return (
            <Card>
                <p className="text-red-600 text-center py-8">
                    Failed to load meetings. Please try again later.
                </p>
            </Card>
        );
    }

    const filteredMeetings = filterMeetings(meetings);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">My Defense Meetings</h1>
                <div className="text-sm text-gray-600">
                    Total: <span className="font-semibold">{meetings?.length || 0}</span> meetings
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setSelectedTab('upcoming')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                            selectedTab === 'upcoming'
                                ? 'border-primary-500 text-primary-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        Upcoming
                        <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                            selectedTab === 'upcoming' ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-600'
                        }`}>
                            {filterMeetings(meetings).length}
                        </span>
                    </button>
                    <button
                        onClick={() => setSelectedTab('pending')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                            selectedTab === 'pending'
                                ? 'border-primary-500 text-primary-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        Pending
                        <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                            selectedTab === 'pending' ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-600'
                        }`}>
                            {meetings?.filter(m => m.state === 'JURY_SELECTION' || m.state === 'TIME_SELECTION').length || 0}
                        </span>
                    </button>
                    <button
                        onClick={() => setSelectedTab('past')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                            selectedTab === 'past'
                                ? 'border-primary-500 text-primary-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        Past
                        <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                            selectedTab === 'past' ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-600'
                        }`}>
                            {filterMeetings(meetings).length}
                        </span>
                    </button>
                </nav>
            </div>

            {/* Meetings List */}
            {filteredMeetings.length === 0 ? (
                <Card>
                    <p className="text-gray-600 text-center py-8">
                        No {selectedTab} meetings found.
                    </p>
                </Card>
            ) : (
                <div className="space-y-4">
                    {filteredMeetings.map((meeting: Meeting) => (
                        <Card key={meeting.id}>
                            <div className="space-y-4">
                                {/* Meeting Header */}
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start space-x-3">
                                        {getMeetingStateIcon(meeting.state)}
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {meeting.thesis.studentFirstName} {meeting.thesis.studentLastName}'s Defense
                                            </h3>
                                            <p className="text-sm text-gray-600 mt-1">
                                                {meeting.thesis.title}
                                            </p>
                                        </div>
                                    </div>
                                    {getMeetingStateBadge(meeting.state)}
                                </div>

                                {/* Meeting Details Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                                    {/* Date & Time */}
                                    {meeting.selectedTimeSlot && (
                                        <div className="flex items-start space-x-3">
                                            <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-700">Date & Time</p>
                                                <p className="text-sm text-gray-600">
                                                    {new Date(meeting.selectedTimeSlot.date).toLocaleDateString()} at {meeting.selectedTimeSlot.timePeriod}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Location */}
                                    {meeting.location && (
                                        <div className="flex items-start space-x-3">
                                            <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-700">Location</p>
                                                <p className="text-sm text-gray-600">{meeting.location}</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Jury Members */}
                                    <div className="flex items-start space-x-3 md:col-span-2">
                                        <Users className="h-5 w-5 text-gray-400 mt-0.5" />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-700 mb-2">
                                                Jury Members ({meeting.juryMembers.length})
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {meeting.juryMembers.map((member) => (
                                                    <span
                                                        key={member.id}
                                                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                                                    >
                                                        {member.firstName} {member.lastName}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons for Pending Meetings */}
                                {meeting.state === 'JURY_SELECTION' && (
                                    <div className="pt-4 border-t border-gray-200 space-y-4">
                                        {/* Expandable Time Slots Section */}
                                        <button
                                            onClick={() => {
                                                const newExpanded = new Set(expandedMeetings);
                                                if (newExpanded.has(meeting.id)) {
                                                    newExpanded.delete(meeting.id);
                                                } else {
                                                    newExpanded.add(meeting.id);
                                                }
                                                setExpandedMeetings(newExpanded);
                                            }}
                                            className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                        >
                                            <span className="font-medium text-gray-900">
                                                View Jury Member Availability
                                            </span>
                                            {expandedMeetings.has(meeting.id) ? (
                                                <ChevronUp className="h-5 w-5 text-gray-500" />
                                            ) : (
                                                <ChevronDown className="h-5 w-5 text-gray-500" />
                                            )}
                                        </button>

                                        {/* Time Slots Comparison (shown when expanded) */}
                                        {expandedMeetings.has(meeting.id) && (
                                            <TimeSlotComparisonWrapper meetingId={meeting.id} />
                                        )}

                                        {/* Action Button */}
                                        <button
                                            onClick={() => {
                                                window.location.href = `/professor/meetings/${meeting.id}/specify-time`;
                                            }}
                                            className="w-full sm:w-auto px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                                        >
                                            {meeting.juryMembers.some(jm => jm.id === currentProfessorId && timeSlots?.length > 0)
                                                ? 'Update My Time Slots'
                                                : 'Specify My Available Time Slots'}
                                        </button>
                                    </div>
                                )}

                                {/* Meeting Info Footer */}
                                <div className="text-xs text-gray-500 pt-2 border-t border-gray-100">
                                    Created on {new Date(meeting.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};
