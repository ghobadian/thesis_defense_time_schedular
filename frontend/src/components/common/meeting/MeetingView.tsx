// src/components/common/meeting/MeetingView.tsx
import React, {useState} from 'react';
import {AlertCircle} from 'lucide-react';
import {Card} from '../Card';
import {Meeting} from '../../../types';
import {MeetingCard} from './MeetingCard';

export interface MeetingViewProps {
    meetings: Meeting[];
    isLoading: boolean;
    onMeetingAction?: (meeting: Meeting) => void;
    actionButtonLabel?: (meeting: Meeting) => string | null;
    showActionButton?: (meeting: Meeting) => boolean;
    userRole: 'professor' | 'student';
    renderAdditionalContent?: (meeting: Meeting, isExpanded: boolean) => React.ReactNode;
    renderTimeSlotsComparison?: (meeting: Meeting) => React.ReactNode;
    canViewTimeSlots?: (meeting: Meeting) => boolean;
    onCancelMeeting?: (meeting: Meeting) => void;
    canCancelMeeting?: (meeting: Meeting) => boolean;
    isCancelling?: boolean;
    // Reassign Juries
    onReassignJuries?: (meeting: Meeting) => void;
    canReassignJuries?: (meeting: Meeting) => boolean;
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
                                                            onCancelMeeting,
                                                            canCancelMeeting,
                                                            isCancelling,
                                                            onReassignJuries,
                                                            canReassignJuries,
                                                        }) => {
    const [expandedMeetingId, setExpandedMeetingId] = useState<number | null>(null);
    const [showTimeSlotsForMeeting, setShowTimeSlotsForMeeting] = useState<number | null>(null);

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
                    <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4"/>
                    <p className="text-gray-600">No meetings found.</p>
                </div>
            </Card>
        );
    }

    return (
        <div className="grid gap-6">
            {meetings.map((meeting) => (
                <MeetingCard
                    key={meeting.id}
                    meeting={meeting}
                    userRole={userRole}
                    isExpanded={expandedMeetingId === meeting.id}
                    onToggleExpand={() =>
                        setExpandedMeetingId(expandedMeetingId === meeting.id ? null : meeting.id)
                    }
                    shouldShowAction={showActionButton?.(meeting) ?? false}
                    actionLabel={actionButtonLabel?.(meeting) ?? null}
                    onMeetingAction={onMeetingAction}
                    showTimeSlots={showTimeSlotsForMeeting === meeting.id}
                    canViewSlots={canViewTimeSlots?.(meeting) ?? false}
                    onToggleTimeSlots={() =>
                        setShowTimeSlotsForMeeting(
                            showTimeSlotsForMeeting === meeting.id ? null : meeting.id
                        )
                    }
                    renderTimeSlotsComparison={renderTimeSlotsComparison}
                    showCancelButton={canCancelMeeting?.(meeting) ?? false}
                    onCancelMeeting={onCancelMeeting}
                    isCancelling={isCancelling}
                    renderAdditionalContent={renderAdditionalContent}
                    showReassignJuriesButton={canReassignJuries?.(meeting) ?? false}
                    onReassignJuries={onReassignJuries}
                />
            ))}
        </div>
    );
};
