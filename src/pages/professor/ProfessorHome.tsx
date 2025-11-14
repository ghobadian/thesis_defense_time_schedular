import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from '../../components/common/Card';
import { FileText, Calendar, Clock, CheckCircle } from 'lucide-react';
import { professorAPI } from '../../api/professor.api';

export const ProfessorHome: React.FC = () => {
    const { data: pendingForms } = useQuery({
        queryKey: ['pendingThesisForms'],
        queryFn: professorAPI.getPendingThesisForms,
    });

    const { data: timeSlots } = useQuery({
        queryKey: ['myTimeSlots'],
        queryFn: professorAPI.getMyTimeSlots,
    });

    const { data: meetings } = useQuery({
        queryKey: ['professorMeetings'],
        queryFn: professorAPI.getMeetings,
    });

    const stats = {
        pendingForms: pendingForms?.length || 0,
        timeSlots: timeSlots?.filter((s: any) => s.isAvailable).length || 0,
        scheduledMeetings: meetings?.filter((m: any) => m.state === 'SCHEDULED').length || 0,
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">
                Professor Dashboard</h1>

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

                <Card className="bg-purple-50">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-600 text-sm font-medium">Scheduled Meetings</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.scheduledMeetings}</p>
                        </div>
                        <Calendar className="h-8 w-8 text-purple-600" />
                    </div>
                </Card>
            </div>

            {/* Recent Activity */}
            <Card title="Recent Submissions">
                <div className="space-y-4">
                    {pendingForms?.slice(0, 5).map((form: any) => (
                        <div key={form.id} className="flex items-center justify-between py-3 border-b">
                            <div>
                                <p className="font-medium text-gray-900">{form.title}</p>
                                <p className="text-sm text-gray-500">
                                    {form.studentFirstName} {form.studentLastName}
                                </p>
                            </div>
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                Pending Review
                            </span>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};
