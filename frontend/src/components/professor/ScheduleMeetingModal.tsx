// src/components/professor/ScheduleMeetingModal.tsx
import React, {useState, useEffect} from 'react';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {professorAPI} from '../../api/professor.api';
import {Modal} from '../common/Modal';
import {Button} from '../common/Button';
import {Card} from '../common/Card';
import {Calendar, Clock, MapPin, CheckCircle, AlertCircle, User, BookOpen} from 'lucide-react';
import {Meeting, TimePeriod} from '../../types';
import {format, parseISO} from 'date-fns';
import {useTranslation} from "react-i18next";

interface ScheduleMeetingModalProps {
    isOpen: boolean;
    onClose: () => void;
    meeting: Meeting;
}

export const ScheduleMeetingModal: React.FC<ScheduleMeetingModalProps> = ({
                                                                              isOpen,
                                                                              onClose,
                                                                              meeting
                                                                          }) => {
    const {t} = useTranslation("professor");
    const queryClient = useQueryClient();
    const [location, setLocation] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // Reset state when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            setLocation('');
            setError(null);
            setSuccess(false);
        }
    }, [isOpen]);

    const scheduleMutation = useMutation({
        mutationFn: (data: { meetingId: number; location: string; }) =>
            professorAPI.scheduleMeeting(data),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['myMeetings']});
            queryClient.invalidateQueries({queryKey: ['meeting', meeting.id]});
            setSuccess(true);
            setError(null);

            // Close modal after success
            setTimeout(() => {
                onClose();
            }, 2000);
        },
        onError: (error: any) => {
            setError(error.response?.data?.message || 'Failed to schedule meeting');
            setSuccess(false);
        }
    });

    const handleSchedule = () => {
        if (!location.trim()) {
            setError('Please enter a location for the meeting');
            return;
        }

        setError(null);
        scheduleMutation.mutate({
            meetingId: meeting.id,
            location: location.trim()
        });
    };

    const formatPeriod = (period: TimePeriod): string => {
        const periodMap: Record<TimePeriod, string> = {
            [TimePeriod.PERIOD_7_30_9_00]: '7:30 AM - 9:00 AM',
            [TimePeriod.PERIOD_9_00_10_30]: '9:00 AM - 10:30 AM',
            [TimePeriod.PERIOD_10_30_12_00]: '10:30 AM - 12:00 PM',
            [TimePeriod.PERIOD_13_30_15_00]: '1:30 PM - 3:00 PM',
            [TimePeriod.PERIOD_15_30_17_00]: '3:30 PM - 5:00 PM'
        };
        return periodMap[period] || period;
    };

    const studentSelectedSlot = meeting?.selectedTimeSlot;

    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={t("schedule_defense_meeting")}>
            <div className="space-y-5">
                {/* Success Message */}
                {success &&
                    <div className="flex items-start space-x-3 bg-green-50 border border-green-200 rounded-lg p-4">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5"/>
                        <div>
                            <p className="text-sm font-medium text-green-800">{t("meeting_scheduled_successfully")}

                            </p>
                            <p className="text-sm text-green-700 mt-1">{t("all_participants_will_be_notified")}

                            </p>
                        </div>
                    </div>
                }

                {/* Error Message */}
                {error &&
                    <div className="flex items-start space-x-3 bg-red-50 border border-red-200 rounded-lg p-4">
                        <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5"/>
                        <p className="text-sm text-red-800">{error}</p>
                    </div>
                }

                {/* Meeting Info Summary */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <h5 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">{t("meeting_details")}

                    </h5>

                    {/* Thesis Title */}
                    <div className="flex items-start">
                        <BookOpen className="w-4 h-4 mr-2 text-gray-500 mt-0.5"/>
                        <div>
                            <p className="text-xs text-gray-500">{t("thesis")}</p>
                            <p className="text-sm font-medium text-gray-900">{meeting.thesis.title}</p>
                        </div>
                    </div>

                    {/* Student */}
                    <div className="flex items-start">
                        <User className="w-4 h-4 mr-2 text-gray-500 mt-0.5"/>
                        <div>
                            <p className="text-xs text-gray-500">{t("student")}</p>
                            <p className="text-sm font-medium text-gray-900">
                                {meeting.thesis.studentFirstName} {meeting.thesis.studentLastName}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Student's Selected Time Slot */}
                {studentSelectedSlot ?
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
                            <CheckCircle className="w-4 h-4 mr-2 text-blue-600"/>{t("students_selected_time")}

                        </h5>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center text-gray-700">
                                <Calendar className="w-5 h-5 mr-2 text-blue-600"/>
                                <div>
                                    <p className="text-xs text-gray-500">{t("date")}</p>
                                    <p className="text-sm font-medium">
                                        {format(parseISO(studentSelectedSlot.date), 'EEE, MMM d, yyyy')}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center text-gray-700">
                                <Clock className="w-5 h-5 mr-2 text-blue-600"/>
                                <div>
                                    <p className="text-xs text-gray-500">{t("time")}</p>
                                    <p className="text-sm font-medium">
                                        {formatPeriod(studentSelectedSlot.timePeriod)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div> :

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <p className="text-yellow-800 text-center">
                            {t("student_has_not_selected_a_time_slot_yet")}
                        </p>
                    </div>
                }

                {/* Location Input */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <MapPin className="inline h-4 w-4 mr-1"/>{t("meeting_location_1")}
                        <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => {
                            setLocation(e.target.value);
                            if (error) setError(null);
                        }}
                        placeholder={t("eg_room_305_building_a_main_campus")}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        disabled={scheduleMutation.isPending || success}
                        autoFocus/>

                    <p className="text-xs text-gray-500 mt-1">{t("enter_the_physical_location_or_virtual_meeting_lin")}

                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t">
                    <Button
                        variant="secondary"
                        onClick={onClose}
                        disabled={scheduleMutation.isPending}
                        className="flex-1">{t("cancel")}


                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleSchedule}
                        isLoading={scheduleMutation.isPending}
                        disabled={!location.trim() || scheduleMutation.isPending || success || !studentSelectedSlot}
                        className="flex-1">

                        {success ? t('scheduled') : t('schedule-meeting')}
                    </Button>
                </div>
            </div>
        </Modal>);

};