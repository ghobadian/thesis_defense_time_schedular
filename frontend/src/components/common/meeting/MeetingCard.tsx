import React, {useState} from 'react';
import {
    Calendar, Clock, Users, ChevronDown, ChevronUp,
    MapPin, Eye, EyeOff, XCircle, RefreshCw
} from 'lucide-react';
import {Card} from '../Card';
import {Button} from '../Button';
import {Meeting} from '../../../types';
import {formatTimePeriod} from './meetingUtils';
import {MeetingStatusBadge} from './MeetingStatusBadge';
import {MeetingCancelConfirm} from './MeetingCancelConfirm';
import {MeetingDetails} from './MeetingDetails';
import {useTranslation} from "react-i18next";

interface MeetingCardProps {
    meeting: Meeting;
    userRole: 'professor' | 'student';
    isExpanded: boolean;
    onToggleExpand: () => void;
    // Action button
    shouldShowAction: boolean;
    actionLabel: string | null;
    onMeetingAction?: (meeting: Meeting) => void;
    // Time slots
    showTimeSlots: boolean;
    canViewSlots: boolean;
    onToggleTimeSlots: () => void;
    renderTimeSlotsComparison?: (meeting: Meeting) => React.ReactNode;
    // Cancel
    showCancelButton: boolean;
    onCancelMeeting?: (meeting: Meeting) => void;
    isCancelling?: boolean;
    // Reassign Juries
    showReassignJuriesButton?: boolean;
    onReassignJuries?: (meeting: Meeting) => void;
    // Additional content
    renderAdditionalContent?: (meeting: Meeting, isExpanded: boolean) => React.ReactNode;
}

export const MeetingCard: React.FC<MeetingCardProps> = ({
                                                            meeting,
                                                            userRole,
                                                            isExpanded,
                                                            onToggleExpand,
                                                            shouldShowAction,
                                                            actionLabel,
                                                            onMeetingAction,
                                                            showTimeSlots,
                                                            canViewSlots,
                                                            onToggleTimeSlots,
                                                            renderTimeSlotsComparison,
                                                            showCancelButton,
                                                            onCancelMeeting,
                                                            isCancelling = false,
                                                            showReassignJuriesButton = false,
                                                            onReassignJuries,
                                                            renderAdditionalContent
                                                        }) => {
    const {t} = useTranslation("common");
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);

    return (
        <Card className="hover:shadow-md transition-shadow">
            <div className="p-4">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                    <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900">
                                    {meeting.thesis?.title || 'Thesis Defense'}
                                </h3>
                                {userRole === 'professor' &&
                                    <p className="text-gray-600 mt-1">{t("student")}
                                        {meeting.thesis?.studentFirstName} {meeting.thesis?.studentLastName}
                                    </p>
                                }
                                <p className="text-gray-600 mt-1">{t("instructor")}
                                    {meeting.thesis?.instructorFirstName} {meeting.thesis?.instructorLastName}
                                </p>
                            </div>
                            <MeetingStatusBadge state={meeting.state} userRole={userRole}/>
                        </div>

                        {/* Metadata grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
                            <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-2 text-gray-400"/>
                                {meeting.selectedTimeSlot ?
                                    new Date(meeting.selectedTimeSlot.date).toLocaleDateString() :
                                    <span className="text-yellow-600">{t("date_pending")}</span>
                                }
                            </div>
                            <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-2 text-gray-400"/>
                                {meeting.selectedTimeSlot?.timePeriod ?
                                    formatTimePeriod(meeting.selectedTimeSlot.timePeriod) :
                                    'Time pending'
                                }
                            </div>
                            <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-2 text-gray-400"/>
                                {meeting.location || 'Location TBD'}
                            </div>
                            <div className="flex items-center">
                                <Users className="h-4 w-4 mr-2 text-gray-400"/>{t("jury_members")}
                                {meeting.juryMembers?.length || 0}
                            </div>
                        </div>

                        {/* Action required banner */}
                        {shouldShowAction && actionLabel &&
                            <div className="flex items-center text-xs text-orange-600 bg-orange-50 px-3 py-2 rounded">
                                <div className="w-2 h-2 bg-orange-500 rounded-full mr-2 animate-pulse"/>
                                {t("action_required")}
                                {actionLabel}
                            </div>
                        }
                    </div>

                    {/* Buttons column */}
                    <div className="flex flex-col space-y-2">
                        <Button onClick={onToggleExpand} variant="primary" className="whitespace-nowrap">
                            {isExpanded ?
                                <>{t("hide_details")}<ChevronUp className="h-4 w-4 ml-2"/></> :

                                <>{t("view_details")}<ChevronDown className="h-4 w-4 ml-2"/></>
                            }
                        </Button>

                        {shouldShowAction && actionLabel && onMeetingAction &&
                            <Button variant="secondary" onClick={() => onMeetingAction(meeting)}
                                    className="whitespace-nowrap">
                                {actionLabel}
                            </Button>
                        }

                        {canViewSlots && renderTimeSlotsComparison &&
                            <Button variant="secondary" onClick={onToggleTimeSlots} className="whitespace-nowrap">
                                {showTimeSlots ?
                                    <><EyeOff className="h-4 w-4 mr-2"/>{t("hide_time_slots")}</> :

                                    <><Eye className="h-4 w-4 mr-2"/>{t("view_time_slots")}</>
                                }
                            </Button>
                        }

                        {showReassignJuriesButton && onReassignJuries &&
                            <Button
                                variant="secondary"
                                onClick={() => onReassignJuries(meeting)}
                                className="whitespace-nowrap">

                                <RefreshCw className="h-4 w-4 mr-2"/>{t("reassign_juries")}

                            </Button>
                        }

                        {showCancelButton && onCancelMeeting &&
                            <Button
                                variant="secondary"
                                onClick={() => setShowCancelConfirm(true)}
                                disabled={isCancelling}
                                className="whitespace-nowrap bg-red-50 text-red-700 border-red-300 hover:bg-red-100 hover:border-red-400">

                                <XCircle className="h-4 w-4 mr-2"/>{t("cancel_meeting")}

                            </Button>
                        }
                    </div>
                </div>

                {/* Cancel Confirmation */}
                {showCancelConfirm &&
                    <MeetingCancelConfirm
                        meeting={meeting}
                        isCancelling={isCancelling}
                        onConfirm={(m) => {
                            onCancelMeeting?.(m);
                            setShowCancelConfirm(false);
                        }}
                        onDismiss={() => setShowCancelConfirm(false)}/>

                }

                {/* Time Slots Comparison */}
                {showTimeSlots && canViewSlots && renderTimeSlotsComparison &&
                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">{t("time_slots_comparison")}</h4>
                        {renderTimeSlotsComparison(meeting)}
                    </div>
                }

                {/* Expanded Details */}
                {isExpanded &&
                    <MeetingDetails
                        meeting={meeting}
                        userRole={userRole}
                        renderAdditionalContent={renderAdditionalContent}/>

                }
            </div>
        </Card>);

};