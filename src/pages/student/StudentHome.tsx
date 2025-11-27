import React from 'react';
import {useQuery} from '@tanstack/react-query';
import {Card} from '../../components/common/Card';
import {Calendar, CheckCircle, Clock, FileText} from 'lucide-react';
import {studentAPI} from '../../api/student.api';
import {FormState, Meeting, MeetingState, ThesisForm} from "../../types";

export const StudentHome: React.FC = () => {
    const { data: thesisForms } = useQuery({
        queryKey: ['myThesisForms'],
        queryFn: studentAPI.getMyThesisForms,
    });

    const { data: meetings } = useQuery({
        queryKey: ['myMeetings'],
        queryFn: studentAPI.getMeetings,
    });

    const stats = {
        totalForms: thesisForms?.length || 0,
        pendingForms: thesisForms?.filter((f: ThesisForm) => f.state === FormState.SUBMITTED).length || 0,
        approvedForms: thesisForms?.filter((f: ThesisForm) => f.state.includes('APPROVED')).length || 0,
        scheduledMeetings: meetings?.filter((m: Meeting) => m.state === MeetingState.SCHEDULED).length || 0,
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-blue-50">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-600 text-sm font-medium">Total Forms</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalForms}</p>
                        </div>
                        <FileText className="h-8 w-8 text-blue-600" />
                    </div>
                </Card>

                <Card className="bg-yellow-50">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-yellow-600 text-sm font-medium">Pending</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.pendingForms}</p>
                        </div>
                        <Clock className="h-8 w-8 text-yellow-600" />
                    </div>
                </Card>

                <Card className="bg-green-50">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-600 text-sm font-medium">Approved</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.approvedForms}</p>
                        </div>
                        <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                </Card>

                <Card className="bg-purple-50">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-600 text-sm font-medium">Meetings</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.scheduledMeetings}</p>
                        </div>
                        <Calendar className="h-8 w-8 text-purple-600" />
                    </div>
                </Card>
            </div>

            {/* Recent Activity */}
            <Card title="Recent Activity">
                <div className="space-y-4">
                    {thesisForms?.slice(0, 3).map((form: ThesisForm) => (
                        <div key={form.id} className="flex items-center justify-between py-3 border-b">
                            <div>
                                <p className="font-medium text-gray-900">{form.title}</p>
                                <p className="text-sm text-gray-500">
                                    Submitted on {new Date(form.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                form.state === 'SUBMITTED' ? 'bg-yellow-100 text-yellow-800' :
                                    form.state.includes('APPROVED') ? 'bg-green-100 text-green-800' :
                                        'bg-red-100 text-red-800'
                            }`}>
                {form.state.replace(/_/g, ' ')}
              </span>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};
