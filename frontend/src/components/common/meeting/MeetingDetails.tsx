// src/components/common/meeting/MeetingDetails.tsx
import React from 'react';
import {Ban} from 'lucide-react';
import {Meeting, MeetingState} from '../../../types';
import {MeetingTimeline} from './MeetingTimeline';
import {MeetingThesisInfo} from './MeetingThesisInfo';
import {MeetingJuryList} from './MeetingJuryList';
import {MeetingScheduleInfo} from './MeetingScheduleInfo';
import {useTranslation} from "react-i18next";

interface MeetingDetailsProps {
    meeting: Meeting;
    userRole: 'professor' | 'student';
    renderAdditionalContent?: (meeting: Meeting, isExpanded: boolean) => React.ReactNode;
}

export const MeetingDetails: React.FC<MeetingDetailsProps> = ({
                                                                  meeting,
                                                                  userRole,
                                                                  renderAdditionalContent
                                                              }) =>
{
    const {t} = useTranslation("common");
    return (<div className="mt-6 pt-6 border-t border-gray-200 space-y-6">
        {/* Thesis Information */}
        <MeetingThesisInfo meeting={meeting} userRole={userRole}/>

        {/* Jury Members */}
        <MeetingJuryList meeting={meeting}/>

        {/* Meeting Schedule (if scheduled) */}
        {meeting.state === MeetingState.SCHEDULED &&
            <MeetingScheduleInfo meeting={meeting}/>
        }

        {/* Cancellation Notice Banner */}
        {meeting.state === MeetingState.CANCELED &&
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                    <Ban className="h-6 w-6 text-red-600 flex-shrink-0"/>
                    <div>
                        <h4 className="text-md font-semibold text-red-800">{t("this_meeting_has_been_canceled")}

                        </h4>
                        <p className="text-sm text-red-600 mt-1">{t("the_defense_meeting_was_canceled_and_is_no_longer")}

                        </p>
                    </div>
                </div>
            </div>
        }

        {/* Meeting Progress Timeline */}
        <MeetingTimeline meeting={meeting}/>

        {/* Additional Content from parent */}
        {renderAdditionalContent?.(meeting, true)}
    </div>)
};