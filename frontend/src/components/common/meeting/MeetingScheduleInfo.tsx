// src/components/common/meeting/MeetingScheduleInfo.tsx
import React from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { Meeting } from '../../../types';
import { formatTimePeriod } from './meetingUtils';

interface MeetingScheduleInfoProps {
    meeting: Meeting;
}

export const MeetingScheduleInfo: React.FC<MeetingScheduleInfoProps> = ({ meeting }) => {
    if (!meeting.selectedTimeSlot) return null;

    return (
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
                                    day: 'numeric',
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
    );
};
