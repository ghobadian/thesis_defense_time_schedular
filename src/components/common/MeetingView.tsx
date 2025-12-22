// src/components/common/MeetingView.tsx
import React, { useState } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import {
    Calendar,
    Clock,
    Users,
    ChevronDown,
    ChevronUp,
    MapPin,
    AlertCircle,
    Mail,
    Eye,
    EyeOff
} from 'lucide-react';
import { Meeting, MeetingState, SimpleUser, TimePeriod } from '../../types';

interface MeetingViewProps {
    meetings: Meeting[];
    isLoading: boolean;
    onMeetingAction?: (meeting: Meeting) => void;
    actionButtonLabel?: (meeting: Meeting) => string | null;
    showActionButton?: (meeting: Meeting) => boolean;
    userRole: 'professor' | 'student';
    renderAdditionalContent?: (meeting: Meeting, isExpanded: boolean) => React.ReactNode;
    renderTimeSlotsComparison?: (meeting: Meeting) => React.ReactNode;
    canViewTimeSlots?: (meeting: Meeting) => boolean;
}

export const MeetingView: React.FC<MeetingViewProps> = ({
                                                            meetings,
                                                            isLoading,
                                                            onMeetingAction,
                                                            actionButtonLabel,
                                                            showActionButton,
                                                            userRole,
                                                            renderAdditionalContent,
                                                            renderTimeSlotsComparison,
                                                            canViewTimeSlots,
                                                        }) => {
    const [expandedMeetingId, setExpandedMeetingId] = useState<number | null>(null);
    const [showTimeSlotsForMeeting, setShowTimeSlotsForMeeting] = useState<number | null>(null);

    const toggleMeetingDetails = (meetingId: number) => {
        setExpandedMeetingId(expandedMeetingId === meetingId ? null : meetingId);
    };

    const toggleTimeSlotsView = (meetingId: number) => {
        setShowTimeSlotsForMeeting(showTimeSlotsForMeeting === meetingId ? null : meetingId);
    };

    const getStatusColor = (state: MeetingState) => {
        switch (state) {
            case MeetingState.JURIES_SELECTED:
                return 'bg-orange-100 text-orange-800';
            case MeetingState.JURIES_SPECIFIED_TIME:
                return 'bg-blue-100 text-blue-800';
            case MeetingState.STUDENT_SPECIFIED_TIME:
                return 'bg-purple-100 text-purple-800';
            case MeetingState.SCHEDULED:
                return 'bg-green-100 text-green-800';
            case MeetingState.COMPLETED:
                return 'bg-gray-100 text-gray-800';
            case MeetingState.CANCELED:
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusLabel = (state: MeetingState): string => {
        switch (state) {
            case MeetingState.JURIES_SELECTED:
                return 'Awaiting Jury Time Selection';
            case MeetingState.JURIES_SPECIFIED_TIME:
                return userRole === 'student' ? 'Ready for Your Selection' : 'Awaiting Student Selection';
            case MeetingState.STUDENT_SPECIFIED_TIME:
                return 'Awaiting Manager Schedule';
            case MeetingState.SCHEDULED:
                return 'Scheduled';
            case MeetingState.COMPLETED:
                return 'Completed';
            case MeetingState.CANCELED:
                return 'Canceled';
            default:
                return state;
        }
    };

    const formatTimePeriod = (period: TimePeriod): string => {
        const periodMap: Record<TimePeriod, string> = {
            [TimePeriod.PERIOD_7_30_9_00]: '7:30 AM - 9:00 AM',
            [TimePeriod.PERIOD_9_00_10_30]: '9:00 AM - 10:30 AM',
            [TimePeriod.PERIOD_10_30_12_00]: '10:30 AM - 12:00 PM',
            [TimePeriod.PERIOD_13_30_15_00]: '1:30 PM - 3:00 PM',
            [TimePeriod.PERIOD_15_30_17_00]: '3:30 PM - 5:00 PM'
        };
        return periodMap[period] || period;
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-gray-500">Loading meetings...</div>
            </div>
        );
    }

    if (!meetings || meetings.length === 0) {
        return (
            <Card>
                <div className="text-center py-12">
                    <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No meetings found.</p>
                </div>
            </Card>
        );
    }

    return (
        <div className="grid gap-6">
            {meetings.map((meeting: Meeting) => {
                const isExpanded = expandedMeetingId === meeting.id;
                const showTimeSlots = showTimeSlotsForMeeting === meeting.id;
                const shouldShowAction = showActionButton?.(meeting) ?? false;
                const actionLabel = actionButtonLabel?.(meeting);
                const canViewSlots = canViewTimeSlots?.(meeting) ?? false;

                return (
                    <Card key={meeting.id} className="hover:shadow-md transition-shadow">
                        <div className="p-4">
                            {/* Main Meeting Card */}
                            <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                                <div className="flex-1 space-y-3">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-900">
                                                {meeting.thesis?.title || "Thesis Defense"}
                                            </h3>
                                            {userRole === 'professor' && (
                                                <p className="text-gray-600 mt-1">
                                                    Student: {meeting.thesis?.studentFirstName} {meeting.thesis?.studentLastName}
                                                </p>
                                            )}

                                            { (
                                                <p className="text-gray-600 mt-1">
                                                    Instructor: {meeting.thesis?.instructorFirstName} {meeting.thesis?.instructorLastName}
                                                </p>
                                            )}

                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(meeting.state)}`}>
                                            {getStatusLabel(meeting.state)}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
                                        <div className="flex items-center">
                                            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                                            {meeting.selectedTimeSlot ? (
                                                new Date(meeting.selectedTimeSlot.date).toLocaleDateString()
                                            ) : (
                                                <span className="text-yellow-600">Date pending</span>
                                            )}
                                        </div>

                                        <div className="flex items-center">
                                            <Clock className="h-4 w-4 mr-2 text-gray-400" />
                                            {meeting.selectedTimeSlot?.timePeriod ? (
                                                formatTimePeriod(meeting.selectedTimeSlot.timePeriod)
                                            ) : (
                                                "Time pending"
                                            )}
                                        </div>

                                        <div className="flex items-center">
                                            <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                                            {meeting.location || "Location TBD"}
                                        </div>

                                        <div className="flex items-center">
                                            <Users className="h-4 w-4 mr-2 text-gray-400" />
                                            Jury Members: {meeting.juryMembers?.length || 0}
                                        </div>
                                    </div>

                                    {shouldShowAction && actionLabel && (
                                        <div className="flex items-center text-xs text-orange-600 bg-orange-50 px-3 py-2 rounded">
                                            <div className="w-2 h-2 bg-orange-500 rounded-full mr-2 animate-pulse"></div>
                                            Action Required: {actionLabel}
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col space-y-2">
                                    <Button
                                        onClick={() => toggleMeetingDetails(meeting.id)}
                                        variant="primary"
                                        className="whitespace-nowrap"
                                    >
                                        {isExpanded ? (
                                            <>
                                                Hide Details
                                                <ChevronUp className="h-4 w-4 ml-2" />
                                            </>
                                        ) : (
                                            <>
                                                View Details
                                                <ChevronDown className="h-4 w-4 ml-2" />
                                            </>
                                        )}
                                    </Button>

                                    {shouldShowAction && actionLabel && onMeetingAction && (
                                        <Button
                                            variant="secondary"
                                            onClick={() => onMeetingAction(meeting)}
                                            className="whitespace-nowrap"
                                        >
                                            {actionLabel}
                                        </Button>
                                    )}

                                    {canViewSlots && renderTimeSlotsComparison && (
                                        <Button
                                            variant="secondary"
                                            onClick={() => toggleTimeSlotsView(meeting.id)}
                                            className="whitespace-nowrap"
                                        >
                                            {showTimeSlots ? (
                                                <>
                                                    <EyeOff className="h-4 w-4 mr-2" />
                                                    Hide Time Slots
                                                </>
                                            ) : (
                                                <>
                                                    <Eye className="h-4 w-4 mr-2" />
                                                    View Time Slots
                                                </>
                                            )}
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {/* Time Slots Comparison Section */}
                            {showTimeSlots && canViewSlots && renderTimeSlotsComparison && (
                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                                        Time Slots Comparison
                                    </h4>
                                    {renderTimeSlotsComparison(meeting)}
                                </div>
                            )}

                            {/* Expanded Details Section */}
                            {isExpanded && (
                                <div className="mt-6 pt-6 border-t border-gray-200 space-y-6">
                                    {/* Thesis Information */}
                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-900 mb-3">Thesis Information</h4>
                                        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-sm text-gray-500">Student Name</p>
                                                    <p className="font-medium text-gray-900">
                                                        {meeting.thesis?.studentFirstName} {meeting.thesis?.studentLastName}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Instructor Name</p>
                                                    <p className="font-medium text-gray-900">
                                                        {meeting.thesis?.instructorFirstName} {meeting.thesis?.instructorLastName}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Student Number</p>
                                                    <p className="font-medium text-gray-900">
                                                        {meeting.thesis?.studentNumber || 'N/A'}
                                                    </p>
                                                </div>
                                                {userRole === 'professor' && (
                                                    <>
                                                        <div>
                                                            <p className="text-sm text-gray-500">Email</p>
                                                            <p className="font-medium text-gray-900 flex items-center">
                                                                <Mail className="h-4 w-4 mr-2 text-gray-400" />
                                                                {meeting.thesis?.studentEmail || 'N/A'}
                                                            </p>
                                                        </div>
                                                    </>
                                                )}
                                                <div>
                                                    <p className="text-sm text-gray-500">Field</p>
                                                    <p className="font-medium text-gray-900">
                                                        {meeting.thesis?.fieldName || 'N/A'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="pt-2">
                                                <p className="text-sm text-gray-500">Abstract</p>
                                                <p className="text-gray-900 mt-1">
                                                    {meeting.thesis?.abstractText || 'No abstract available'}
                                                </p>
                                            </div>

                                            <div className="pt-2">
                                                <p className="text-sm text-gray-500">Score</p>
                                                <p className="text-gray-900 mt-1">
                                                    {meeting.score || 'Not Given Yet'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Jury Members */}
                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-900 mb-3">Jury Members</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {meeting.juryMembers && meeting.juryMembers.length > 0 ? (
                                                meeting.juryMembers.map((jury: SimpleUser) => (
                                                    <div key={jury.id} className="bg-gray-50 rounded-lg p-4">
                                                        <div className="flex items-start">
                                                            <div className="bg-primary-100 rounded-full p-2 mr-3">
                                                                <Users className="h-5 w-5 text-primary-600" />
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-gray-900">
                                                                    {jury.firstName} {jury.lastName}
                                                                </p>
                                                                <p className="text-sm text-gray-500">{meeting.thesis.instructorId === jury.id ? 'Instructor' : 'Professor'}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-gray-500 text-sm">No jury members assigned yet</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Meeting Schedule (if scheduled) */}
                                    {meeting.state === MeetingState.SCHEDULED && meeting.selectedTimeSlot && (
                                        <div>
                                            <h4 className="text-lg font-semibold text-gray-900 mb-3">Meeting Schedule</h4>
                                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <div className="flex items-center">
                                                        <Calendar className="h-5 w-5 mr-2 text-green-600" />
                                                        <div>
                                                            <p className="text-sm text-gray-600">Date</p>
                                                            <p className="font-medium text-gray-900">
                                                                {new Date(meeting.selectedTimeSlot.date).toLocaleDateString('en-US', {
                                                                    weekday: 'long',
                                                                    year: 'numeric',
                                                                    month: 'long',
                                                                    day: 'numeric'
                                                                })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <Clock className="h-5 w-5 mr-2 text-green-600" />
                                                        <div>
                                                            <p className="text-sm text-gray-600">Time</p>
                                                            <p className="font-medium text-gray-900">
                                                                {formatTimePeriod(meeting.selectedTimeSlot.timePeriod)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <MapPin className="h-5 w-5 mr-2 text-green-600" />
                                                        <div>
                                                            <p className="text-sm text-gray-600">Location</p>
                                                            <p className="font-medium text-gray-900">
                                                                {meeting.location || 'TBD'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Meeting Timeline */}
                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-900 mb-3">Meeting Progress</h4>
                                        <div className="relative">
                                            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                                            <div className="space-y-4">
                                                {[
                                                    { state: MeetingState.JURIES_SELECTED, label: 'Jury Selected' },
                                                    { state: MeetingState.JURIES_SPECIFIED_TIME, label: 'Jury Time Specified' },
                                                    { state: MeetingState.STUDENT_SPECIFIED_TIME, label: 'Student Time Selected' },
                                                    { state: MeetingState.SCHEDULED, label: 'Meeting Scheduled' },
                                                    { state: MeetingState.COMPLETED, label: 'Meeting Completed' },
                                                ].map((step, index) => {
                                                    const isCurrent = meeting.state === step.state;
                                                    const isPast = Object.values(MeetingState).indexOf(meeting.state) > index;
                                                    const isActive = isCurrent || isPast;

                                                    return (
                                                        <div key={step.state} className="relative flex items-center">
                                                            <div className={`
                                                                w-8 h-8 rounded-full flex items-center justify-center z-10
                                                                ${isActive ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-500'}
                                                                ${isCurrent ? 'ring-4 ring-primary-100' : ''}
                                                            `}>
                                                                {isPast ? '✓' : index + 1}
                                                            </div>
                                                            <div className="ml-4">
                                                                <p className={`font-medium ${isActive ? 'text-gray-900' : 'text-gray-500'}`}>
                                                                    {step.label}
                                                                </p>
                                                                {isCurrent && (
                                                                    <p className="text-sm text-primary-600">Current Stage</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Additional role-specific content */}
                                    {renderAdditionalContent?.(meeting, isExpanded)}
                                </div>
                            )}
                        </div>
                    </Card>
                );
            })}
        </div>
    );
};
