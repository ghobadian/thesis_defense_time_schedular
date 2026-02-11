// src/pages/professor/ProfessorHome.tsx

import React from 'react';
import {useQuery} from '@tanstack/react-query';
import {Card} from '../../components/common/Card';
import {CheckCircle, Clock, FileText} from 'lucide-react';
import {professorAPI} from '../../api/professor.api';
import {Meeting, MeetingState} from "../../types";

export const ProfessorHome: React.FC = () => {
    const { data: pendingForms } = useQuery({
        queryKey: ['pendingThesisForms'],
        queryFn: professorAPI.getPendingThesisForms,
    });

    const { data: timeSlots } = useQuery({
        queryKey: ['myTimeSlots'],
        queryFn: professorAPI.getMyTimeslots,
    });

    const { data: meetings } = useQuery({
        queryKey: ['professorMeetings'],
        queryFn: professorAPI.getMyMeetings,
    });

    // Added safe navigation (optional chaining) to prevent crashes if data is undefined
    const stats = {
        pendingForms: pendingForms?.length || 0,
        // Assuming timeSlots is an array. If it returns { timeslots: [] }, adjust accordingly.
        timeSlots: Array.isArray(timeSlots) ? timeSlots.length : (timeSlots?.timeslots?.length || 0),
        scheduledMeetings: meetings?.filter((m: Meeting) => m.state === MeetingState.SCHEDULED).length || 0,
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">
                Professor Dashboard
            </h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-yellow-50">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-yellow-600 text-sm font-medium">Pending Forms</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.pendingForms}</p>
                        </div>
                        <FileText className="h-8 w-8 text-yellow-600" />
                    </div>
                </Card>

                <Card className="bg-blue-50">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-600 text-sm font-medium">Available Time Slots</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.timeSlots}</p>
                        </div>
                        <Clock className="h-8 w-8 text-blue-600" />
                    </div>
                </Card>

                <Card className="bg-green-50">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-600 text-sm font-medium">Scheduled Meetings</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.scheduledMeetings}</p>
                        </div>
                        <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                </Card>
            </div>
        </div>
    );
};
