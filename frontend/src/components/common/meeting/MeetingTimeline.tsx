// src/components/common/meeting/MeetingTimeline.tsx
import React from 'react';
import {Ban} from 'lucide-react';
import {Meeting, MeetingState} from '../../../types';
import {NORMAL_FLOW_STEPS, STATE_ORDER, inferLastReachedIndex} from './meetingUtils';
import {useTranslation} from "react-i18next";

interface MeetingTimelineProps {
    meeting: Meeting;
}

const CanceledTimeline: React.FC<{ meeting: Meeting; }> = ({meeting}) => {
    const {t} = useTranslation("common");
    const lastReachedIndex = inferLastReachedIndex(meeting);

    return (
        <>
            {NORMAL_FLOW_STEPS.map((step, index) => {
                const wasCompleted = index < lastReachedIndex;
                const wasLastActive = index === lastReachedIndex;
                const wasNeverReached = index > lastReachedIndex;

                return (
                    <div key={step.state} className="relative flex items-center">
                        <div className={`
                            w-8 h-8 rounded-full flex items-center justify-center z-10
                            ${wasCompleted ?
                            'bg-gray-400 text-white' :
                            wasLastActive ?
                                'bg-red-500 text-white ring-4 ring-red-100' :
                                'bg-gray-200 text-gray-400'}
                        `}>
                            {wasCompleted ? '✓' : wasLastActive ? '✕' : index + 1}
                        </div>
                        <div className="ml-4">
                            <p className={`font-medium ${
                                wasCompleted ?
                                    'text-gray-500 line-through' :
                                    wasLastActive ?
                                        'text-red-700' :
                                        'text-gray-400'}`}>
                                { t(step.labelKey)}
                            </p>
                            {wasLastActive &&
                                <p className="text-sm text-red-500">{t("canceled_at_this_stage")}</p>
                            }
                            {wasNeverReached &&
                                <p className="text-sm text-gray-400">{t("not_reached")}</p>
                            }
                        </div>
                    </div>
                );
            })}

            {/* Terminal canceled node */}
            <div className="relative flex items-center">
                <div className="w-8 h-8 rounded-full flex items-center justify-center z-10 bg-red-600 text-white ring-4 ring-red-100">
                    <Ban className="h-4 w-4"/>
                </div>
                <div className="ml-4">
                    <p className="font-semibold text-red-700">{t("meeting_canceled")}</p>
                    <p className="text-sm text-red-500">{t("this_meeting_has_been_permanently_canceled")}</p>
                </div>
            </div>
        </>
    );
};

const NormalTimeline: React.FC<{ meeting: Meeting; }> = ({meeting}) => {
    const currentStateOrder = STATE_ORDER[meeting.state] ?? -1;
    const {t} = useTranslation("common");

    return (
        <>
            {NORMAL_FLOW_STEPS.map((step, index) => {
                const stepStateOrder = STATE_ORDER[step.state] ?? -1;
                const isCurrent = meeting.state === step.state;
                const isPast = currentStateOrder > stepStateOrder;
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
                                 { t(step.labelKey)}
                            </p>
                            {isCurrent &&
                                <p className="text-sm text-primary-600">{t("current_stage")}</p>
                            }
                        </div>
                    </div>
                );
            })}
        </>
    );
};

export const MeetingTimeline: React.FC<MeetingTimelineProps> = ({meeting}) => {
    const isCanceled = meeting.state === MeetingState.CANCELED;
    const {t} = useTranslation("common");

    return (
        <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3">{t("meeting_progress")}</h4>
            <div className="relative">
                <div className={`absolute left-4 top-0 bottom-0 w-0.5 ${isCanceled ? 'bg-red-200' : 'bg-gray-200'}`}/>
                <div className="space-y-4">
                    {isCanceled ?
                        <CanceledTimeline meeting={meeting}/> :
                        <NormalTimeline meeting={meeting}/>
                    }
                </div>
            </div>
        </div>
    );
};
