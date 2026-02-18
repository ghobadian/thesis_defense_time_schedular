// src/components/common/meeting/meetingUtils.ts
import {MeetingState, TimePeriod} from '../../../types';
import i18n from "i18next";

const t = i18n.t.bind(i18n);

export const NORMAL_FLOW_STEPS = [
    {state: MeetingState.JURIES_SELECTED, label: t("jury_selected")},
    {state: MeetingState.JURIES_SPECIFIED_TIME, label: t("jury_time_specified")},
    {state: MeetingState.STUDENT_SPECIFIED_TIME, label: t("student_time_selected")},
    {state: MeetingState.SCHEDULED, label: t("meeting_scheduled")},
    {state: MeetingState.COMPLETED, label: t("meeting_completed")}];


export const STATE_ORDER: Record<string, number> = {};
NORMAL_FLOW_STEPS.forEach((step, idx) => {
    STATE_ORDER[step.state] = idx;
});

export const getStatusColor = (state: MeetingState): string => {
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

export const getStatusLabel = (state: MeetingState, userRole: 'professor' | 'student'): string => {
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

export const formatTimePeriod = (period: TimePeriod): string => {
    const periodMap: Record<TimePeriod, string> = {
        [TimePeriod.PERIOD_7_30_9_00]: '7:30 AM - 9:00 AM',
        [TimePeriod.PERIOD_9_00_10_30]: '9:00 AM - 10:30 AM',
        [TimePeriod.PERIOD_10_30_12_00]: '10:30 AM - 12:00 PM',
        [TimePeriod.PERIOD_13_30_15_00]: '1:30 PM - 3:00 PM',
        [TimePeriod.PERIOD_15_30_17_00]: '3:30 PM - 5:00 PM'
    };
    return periodMap[period] || period;
};

/**
 * Infer how far a canceled meeting progressed before cancellation.
 */
export const inferLastReachedIndex = (meeting: {
    selectedTimeSlot?: any;
    location?: string;
    juryMembers?: any[];
}): number => {
    if (meeting.selectedTimeSlot && meeting.location) {
        return 3; // SCHEDULED
    }
    if (meeting.selectedTimeSlot) {
        return 2; // STUDENT_SPECIFIED_TIME
    }
    return 0; // JURIES_SELECTED (minimum)
};