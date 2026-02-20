// professor/SpecifyMeetingTimeSlots.tsx
import React, {useState, useEffect} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {Card} from '../../components/common/Card';
import {Button} from '../../components/common/Button';
import {TimeSlotsComparison} from '../../components/professor/TimeSlotsComparison';
import {professorAPI} from '../../api/professor.api';
import {Calendar, Clock, ArrowLeft, Users, Plus, Trash2} from 'lucide-react';
import {TimePeriod, TimeSlot, TimeRange} from '../../types';
import {useAuthStore} from '../../store/authStore';
import {useTranslation} from "react-i18next";

type InputMode = 'slots' | 'ranges';

export const ProfessorSpecifyMeetingTimeSlotsPage: React.FC = () => {
    const {t} = useTranslation("professor");
    const {meetingId} = useParams<{ meetingId: string; }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const {userId} = useAuthStore();

    // Input mode toggle
    const [inputMode, setInputMode] = useState<InputMode>('slots');

    // --- Time Slots state (existing) ---
    const [selectedSlots, setSelectedSlots] = useState<TimeSlot[]>([]);
    const [currentDate, setCurrentDate] = useState('');
    const [currentPeriods, setCurrentPeriods] = useState<TimePeriod[]>([]);

    // --- Time Ranges state (new) ---
    const [timeRanges, setTimeRanges] = useState<TimeRange[]>([]);
    const [currentRangeFrom, setCurrentRangeFrom] = useState('');
    const [currentRangeTo, setCurrentRangeTo] = useState('');

    // Fetch meeting details
    const {data: meeting, isLoading} = useQuery({
        queryKey: ['meeting', meetingId],
        queryFn: () => professorAPI.getMeetingById(Number(meetingId))
    });

    // Fetch ONLY current professor's time slots for this meeting
    const {data: myExistingTimeSlots, isLoading: isLoadingTimeSlots} = useQuery({
        queryKey: ['myMeetingTimeSlots', meetingId, userId],
        queryFn: () => professorAPI.getMyMeetingTimeSlots(Number(meetingId)),
        enabled: !!meetingId && !!userId
    });

    // Populate selectedSlots when existing time slots are loaded
    useEffect(() => {
        if (myExistingTimeSlots && Array.isArray(myExistingTimeSlots)) {
            const formattedSlots: TimeSlot[] = myExistingTimeSlots.map((slot: TimeSlot) => ({
                id: slot.id,
                date: slot.date,
                timePeriod: slot.timePeriod
            }));
            setSelectedSlots(formattedSlots);
        }
    }, [myExistingTimeSlots]);

    // Submit time slots mutation (existing)
    const submitSlotsMutation = useMutation({
        mutationFn: (availableTime: { meetingId: number; timeSlots: TimeSlot[]; }) =>
            professorAPI.submitMeetingTimeSlots(availableTime),
        onSuccess: () => {
            invalidateQueries();
            alert('Time slots updated successfully!');
            navigate(`/professor/meetings/${meetingId}/specify-time`);
        },
        onError: (error: any) => {
            alert(error.response?.data?.message || 'Failed to submit time slots');
        }
    });

    // Submit time ranges mutation (new)
    const submitRangesMutation = useMutation({
        mutationFn: (availableTimeRange: { meetingId: number; timeRanges: TimeRange[]; }) =>
            professorAPI.submitMeetingTimeRanges(availableTimeRange),
        onSuccess: () => {
            invalidateQueries();
            alert('Time ranges submitted successfully!');
            navigate(`/professor/meetings/${meetingId}/specify-time`);
        },
        onError: (error: any) => {
            alert(error.response?.data?.message || 'Failed to submit time ranges');
        }
    });

    const invalidateQueries = () => {
        queryClient.invalidateQueries({queryKey: ['myMeetings']});
        queryClient.invalidateQueries({queryKey: ['meeting', meetingId]});
        queryClient.invalidateQueries({queryKey: ['myMeetingTimeSlots', meetingId, userId]});
        queryClient.invalidateQueries({queryKey: ['myTimeSlots']});
        queryClient.invalidateQueries({queryKey: ['meetingTimeSlots', Number(meetingId)]});
    };

    const periodLabels: Record<TimePeriod, string> = {
        [TimePeriod.PERIOD_7_30_9_00]: '7:30 - 9:00',
        [TimePeriod.PERIOD_9_00_10_30]: '9:00 - 10:30',
        [TimePeriod.PERIOD_10_30_12_00]: '10:30 - 12:00',
        [TimePeriod.PERIOD_13_30_15_00]: '13:30 - 15:00',
        [TimePeriod.PERIOD_15_30_17_00]: '15:30 - 17:00'
    };

    const togglePeriod = (period: TimePeriod) => {
        setCurrentPeriods((prev) =>
            prev.includes(period) ?
                prev.filter((p) => p !== period) :
                [...prev, period]
        );
    };

    const addTimeSlot = () => {
        if (!currentDate || currentPeriods.length === 0) {
            alert('Please select a date and at least one time period');
            return;
        }

        const newTimeSlots: TimeSlot[] = currentPeriods.map((period) => ({
            id: -1,
            date: currentDate,
            timePeriod: period
        }));

        setSelectedSlots((prev) => {
            const existing = prev.filter(
                (slot) => !(slot.date === currentDate && currentPeriods.includes(slot.timePeriod))
            );
            return [...existing, ...newTimeSlots];
        });

        setCurrentDate('');
        setCurrentPeriods([]);
    };

    const removeTimeSlot = (date: string, period?: TimePeriod) => {
        if (period) {
            setSelectedSlots((prev) =>
                prev.filter((slot) => !(slot.date === date && slot.timePeriod === period))
            );
        } else {
            setSelectedSlots((prev) => prev.filter((slot) => slot.date !== date));
        }
    };

    // --- Time Range helpers (new) ---
    const addTimeRange = () => {
        if (!currentRangeFrom || !currentRangeTo) {
            alert('Please specify both "From" and "To" date-times');
            return;
        }
        if (new Date(currentRangeFrom) >= new Date(currentRangeTo)) {
            alert('"From" must be before "To"');
            return;
        }

        // Check for duplicate ranges
        const isDuplicate = timeRanges.some(
            (r) => r.from === currentRangeFrom && r.to === currentRangeTo
        );
        if (isDuplicate) {
            alert('This time range has already been added');
            return;
        }

        setTimeRanges((prev) => [...prev, {from: currentRangeFrom, to: currentRangeTo}]);
        setCurrentRangeFrom('');
        setCurrentRangeTo('');
    };

    const removeTimeRange = (index: number) => {
        setTimeRanges((prev) => prev.filter((_, i) => i !== index));
    };

    const formatDateTimeForDisplay = (isoString: string): string => {
        if (!isoString) return '';
        const date = new Date(isoString);
        return date.toLocaleString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleSubmit = () => {
        if (inputMode === 'slots') {
            if (selectedSlots.length === 0) {
                alert('Please add at least one time slot');
                return;
            }
            submitSlotsMutation.mutate({
                meetingId: Number(meetingId),
                timeSlots: selectedSlots
            });
        } else {
            if (timeRanges.length === 0) {
                alert('Please add at least one time range');
                return;
            }
            submitRangesMutation.mutate({
                meetingId: Number(meetingId),
                timeRanges: timeRanges
            });
        }
    };

    const groupedSlots = selectedSlots.reduce((acc, slot) => {
        if (!acc[slot.date]) {
            acc[slot.date] = [];
        }
        acc[slot.date].push(slot.timePeriod);
        return acc;
    }, {} as Record<string, TimePeriod[]>);

    const isSubmitting = submitSlotsMutation.isPending || submitRangesMutation.isPending;
    const hasData = inputMode === 'slots' ? selectedSlots.length > 0 : timeRanges.length > 0;

    if (isLoading || isLoadingTimeSlots) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-600">{t("loading")}</div>
            </div>);

    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center space-x-4">
                <button
                    onClick={() => navigate('/professor/meetings')}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors">

                    <ArrowLeft className="h-5 w-5 text-gray-600"/>
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        {myExistingTimeSlots && myExistingTimeSlots.length > 0 ?
                            'Update My Available Time Slots' :
                            'Specify My Available Time Slots'}
                    </h1>
                    {meeting &&
                        <p className="text-gray-600 mt-1">{t("for")}
                            {meeting.thesis.title} - {meeting.thesis.studentFirstName} {meeting.thesis.studentLastName}
                        </p>
                    }
                </div>
            </div>

            {/* TIME SLOTS COMPARISON - NEW SECTION */}
            <Card className="bg-blue-50 border-blue-200">
                <div className="flex items-start space-x-3 mb-4">
                    <Users className="h-6 w-6 text-blue-600 mt-1"/>
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">{t("other_jury_members_availability")}

                        </h2>
                        <p className="text-sm text-gray-600 mt-1">{t("see_what_time_slots_other_jury_members_have_alread")}


                        </p>
                    </div>
                </div>
                <TimeSlotsComparison meetingId={Number(meetingId)}/>
            </Card>

            {/* Divider */}
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-gray-50 text-gray-500 font-medium">{t("specify_your_availability_below")}

          </span>
                </div>
            </div>

            {/* Input Mode Toggle */}
            <Card>
                <div className="flex items-center justify-center space-x-2">
                    <span className="text-sm font-medium text-gray-700 mr-2">{t("input_mode")}</span>
                    <button
                        onClick={() => setInputMode('slots')}
                        className={`px-4 py-2 rounded-l-lg border text-sm font-medium transition-colors ${
                            inputMode === 'slots' ?
                                'bg-primary-600 text-white border-primary-600' :
                                'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`
                        }>

                        <Clock className="h-4 w-4 inline mr-1.5"/>{t("predefined_time_slots")}

                    </button>
                    <button
                        onClick={() => setInputMode('ranges')}
                        className={`px-4 py-2 rounded-r-lg border text-sm font-medium transition-colors ${
                            inputMode === 'ranges' ?
                                'bg-primary-600 text-white border-primary-600' :
                                'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`
                        }>

                        <Calendar className="h-4 w-4 inline mr-1.5"/>{t("custom_time_ranges")}

                    </button>
                </div>
                <p className="text-xs text-gray-500 text-center mt-2">
                    {inputMode === 'slots' ?
                        t('select-from-predefined-time-periods') :
                        t('specify-custom-data-time-ranges')}
                </p>
            </Card>

            {/* ==================== SLOTS MODE ==================== */}
            {inputMode === 'slots' &&
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Add Time Slot Form */}
                    <Card title={t("add_available_time_slots")}>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Calendar className="inline h-4 w-4 mr-1"/>{t("select_date")}

                                </label>
                                <input
                                    type="date"
                                    value={currentDate}
                                    onChange={(e) => setCurrentDate(e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"/>

                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Clock className="inline h-4 w-4 mr-1"/>{t("select_time_periods")}

                                </label>
                                <div className="grid grid-cols-1 gap-2">
                                    {Object.entries(periodLabels).map(([period, label]) =>
                                        <button
                                            key={period}
                                            type="button"
                                            onClick={() => togglePeriod(period as TimePeriod)}
                                            className={`p-3 rounded-lg border-2 text-sm font-medium transition-colors text-left ${
                                                currentPeriods.includes(period as TimePeriod) ?
                                                    'border-primary-600 bg-primary-50 text-primary-700' :
                                                    'border-gray-300 hover:border-gray-400'}`
                                            }>

                                            <Clock className="h-4 w-4 inline mr-2"/>
                                            {label}
                                        </button>
                                    )}
                                </div>
                            </div>

                            <Button
                                onClick={addTimeSlot}
                                disabled={!currentDate || currentPeriods.length === 0}
                                variant="secondary"
                                className="w-full">{t("add_to_list")}


                            </Button>
                        </div>
                    </Card>

                    {/* Selected Time Slots */}
                    <Card title={t("selected_time_slots_dates", {length: Object.keys(groupedSlots).length})}>
                        {Object.keys(groupedSlots).length === 0 ?
                            <div className="text-center py-8 text-gray-500">
                                <Clock className="h-12 w-12 mx-auto mb-3 text-gray-400"/>
                                <p>{t("no_time_slots_added_yet")}</p>
                                <p className="text-sm mt-1">{t("add_available_dates_and_times_from_the_form")}</p>
                            </div> :

                            <div className="space-y-3 max-h-96 overflow-y-auto">
                                {Object.entries(groupedSlots).sort(([dateA], [dateB]) => dateA.localeCompare(dateB)).map(([date, periods]) =>
                                    <div key={date} className="border rounded-lg p-3 bg-gray-50">
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="font-medium text-gray-900">
                                                {new Date(date).toLocaleDateString('en-US', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                            <button
                                                onClick={() => removeTimeSlot(date)}
                                                className="text-red-600 hover:text-red-800 text-sm">{t("remove_all")}


                                            </button>
                                        </div>
                                        <div className="space-y-1">
                                            {periods.map((period) =>
                                                <div
                                                    key={period}
                                                    className="flex items-center justify-between bg-white rounded px-3 py-2">
                  
                                                        <span className="text-sm text-gray-700">
                                                            {periodLabels[period]}
                                                        </span>
                                                    <button
                                                        onClick={() => removeTimeSlot(date, period)}
                                                        className="text-red-600 hover:text-red-800 text-xs">{t("remove")}


                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        }
                    </Card>
                </div>
            }

            {/* ==================== RANGES MODE ==================== */}
            {inputMode === 'ranges' &&
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Add Time Range Form */}
                    <Card title={t("add_available_time_range")}>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Calendar className="inline h-4 w-4 mr-1"/>{t("from_date_time")}

                                </label>
                                <input
                                    type="datetime-local"
                                    value={currentRangeFrom}
                                    onChange={(e) => setCurrentRangeFrom(e.target.value)}
                                    min={new Date().toISOString().slice(0, 16)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"/>

                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Calendar className="inline h-4 w-4 mr-1"/>{t("to_date_time")}

                                </label>
                                <input
                                    type="datetime-local"
                                    value={currentRangeTo}
                                    onChange={(e) => setCurrentRangeTo(e.target.value)}
                                    min={currentRangeFrom || new Date().toISOString().slice(0, 16)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"/>

                            </div>

                            <Button
                                onClick={addTimeRange}
                                disabled={!currentRangeFrom || !currentRangeTo}
                                variant="secondary"
                                className="w-full">

                                <Plus className="h-4 w-4 inline mr-1"/>{t("add_range_to_list")}

                            </Button>
                        </div>
                    </Card>

                    {/* Selected Time Ranges */}
                    <Card title={t("selected_time_ranges", {length: timeRanges.length})}>
                        {timeRanges.length === 0 ?
                            <div className="text-center py-8 text-gray-500">
                                <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-400"/>
                                <p>{t("no_time_ranges_added_yet")}</p>
                                <p className="text-sm mt-1">{t("specify_your_available_datetime_ranges_from_the_fo")}</p>
                            </div> :

                            <div className="space-y-3 max-h-96 overflow-y-auto">
                                {timeRanges.map((range, index) =>
                                    <div key={index} className="border rounded-lg p-3 bg-gray-50">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-2 mb-1">
                                                    <span
                                                        className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded">
                                                        FROM
                                                    </span>
                                                    <span className="text-sm text-gray-900">
                                                        {formatDateTimeForDisplay(range.from)}
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <span
                                                        className="text-xs font-semibold text-red-700 bg-red-100 px-2 py-0.5 rounded">
                                                        TO
                                                    </span>
                                                    <span className="text-sm text-gray-900">
                                                        {formatDateTimeForDisplay(range.to)}
                                                    </span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => removeTimeRange(index)}
                                                className="text-red-600 hover:text-red-800 p-1 ml-2"
                                                title={t("remove_range")}>

                                                <Trash2 className="h-4 w-4"/>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        }
                    </Card>
                </div>
            }

            {/* Submit Button */}
            <Card>
                <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                        {inputMode === 'slots' ?
                            <>
                                <p>{t("total_slots_selected")}<span
                                    className="font-semibold">{selectedSlots.length}</span>
                                </p>
                                <p className="text-xs text-gray-500 mt-1">{t("students_will_be_able_to_choose_from_these_availab")}

                                </p>
                            </> :

                            <>
                                <p>{t("total_ranges_specified")}<span
                                    className="font-semibold">{timeRanges.length}</span>
                                </p>
                                <p className="text-xs text-gray-500 mt-1">{t("the_system_will_derive_available_time_slots_from_y")}

                                </p>
                            </>
                        }
                    </div>
                    <div className="flex space-x-3">
                        <Button
                            variant="secondary"
                            onClick={() => navigate('/professor/meetings')}>{t("cancel")}


                        </Button>
                        <Button
                            onClick={handleSubmit}
                            isLoading={isSubmitting}
                            disabled={!hasData}>

                            {inputMode === 'slots' ? t('submit-time-slots') : t('submit-time-ranges')}
                        </Button>
                    </div>
                </div>
            </Card>
        </div>);

};