// src/pages/admin/AdminHome.tsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from '../../components/common/Card';
import {
    Users,
    GraduationCap,
    FileText,
    Calendar,
    TrendingUp,
    Building,
    BookOpen,
    Activity
} from 'lucide-react';
import { adminAPI } from '../../api/admin.api';
import {DepartmentDetail, DepartmentSummary} from "../../types";

export const AdminHome: React.FC = () => {
    const { data: stats, isLoading: loadingStats } = useQuery({
        queryKey: ['adminStats'],
        queryFn: adminAPI.getStats,
    });

    const { data: departments, isLoading: loadingDepartments } = useQuery({
        queryKey: ['departments'],
        queryFn: adminAPI.getDepartments,
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Activity className="h-4 w-4" />
                    <span>Last updated: {new Date().toLocaleTimeString()}</span>
                </div>
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-blue-50">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-600 text-sm font-medium">Total Students</p>
                            <p className="text-3xl font-bold text-gray-900">
                                {loadingStats ? '...' : stats?.totalStudents || 0}
                            </p>

                        </div>
                        <GraduationCap className="h-12 w-12 text-blue-600" />
                    </div>
                </Card>

                <Card className="bg-purple-50">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-600 text-sm font-medium">Total Professors</p>
                            <p className="text-3xl font-bold text-gray-900">
                                {loadingStats ? '...' : stats?.totalProfessors || 0}
                            </p>
                            <p className="text-xs text-purple-600 mt-1">
                                {stats?.activeProfessors || 0} active this month
                            </p>
                        </div>
                        <Users className="h-12 w-12 text-purple-600" />
                    </div>
                </Card>

                <Card className="bg-green-50">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-600 text-sm font-medium">Thesis Forms</p>
                            <p className="text-3xl font-bold text-gray-900">
                                {loadingStats ? '...' : stats?.totalThesisForms || 0}
                            </p>
                            <p className="text-xs text-green-600 mt-1">
                                {stats?.pendingForms || 0} pending review
                            </p>
                        </div>
                        <FileText className="h-12 w-12 text-green-600" />
                    </div>
                </Card>

                <Card className="bg-yellow-50">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-yellow-600 text-sm font-medium">Defense Meetings</p>
                            <p className="text-3xl font-bold text-gray-900">
                                {loadingStats ? '...' : stats?.totalMeetings || 0}
                            </p>
                            <p className="text-xs text-yellow-600 mt-1">
                                {stats?.upcomingMeetings || 0} upcoming
                            </p>
                        </div>
                        <Calendar className="h-12 w-12 text-yellow-600" />
                    </div>
                </Card>
            </div>

            {/* Department Statistics */}
            <Card title="Department Overview">
                <div className="space-y-4">
                    {loadingDepartments ? (
                        <div className="text-center py-8 text-gray-600">Loading departments...</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {departments?.map((dept: DepartmentDetail) => (
                                <div
                                    key={dept.id}
                                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center space-x-2">
                                            <Building className="h-5 w-5 text-primary-600" />
                                            <h3 className="font-semibold text-gray-900">{dept.name}</h3>
                                        </div>
                                    </div>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Students:</span>
                                            <span className="font-medium text-gray-900">{dept.studentCount || 0}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Professors:</span>
                                            <span className="font-medium text-gray-900">{dept.professorCount || 0}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Fields:</span>
                                            <span className="font-medium text-gray-900">{dept.fieldCount || 0}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Active Thesis:</span>
                                            <span className="font-medium text-gray-900">{dept.activeThesisCount || 0}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </Card>

            {/* System Health */}
            <Card title="System Health">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-3">
                            <Activity className="h-8 w-8 text-green-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">System Status</h3>
                        <p className="text-green-600 font-medium">Operational</p>
                    </div>
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-3">
                            <BookOpen className="h-8 w-8 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">Active Sessions</h3>
                        <p className="text-2xl font-bold text-gray-900">{stats?.activeSessions || 0}</p>
                    </div>
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-3">
                            <TrendingUp className="h-8 w-8 text-purple-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">System Load</h3>
                        <p className="text-green-600 font-medium">Normal</p>
                    </div>
                </div>
            </Card>
        </div>
    );
};
