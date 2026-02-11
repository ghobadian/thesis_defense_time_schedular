// src/pages/admin/DefenseMeetings.tsx
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminAPI } from '../../api/admin.api';
import { Card } from '../../components/common/Card';
import {
    Calendar,
    Search,
    Filter,
    Users,
    MapPin,
    ChevronRight,
    AlertCircle,
    X,
    Clock,
    FileText,
    User
} from 'lucide-react';
import {Meeting, MeetingState} from '../../types';
import { format, parseISO } from 'date-fns';

export const DefenseMeetings: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('ALL');
    const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);

    // Fetch all meetings
    const { data: meetings, isLoading, error } = useQuery({
        queryKey: ['adminMeetings'],
        queryFn: adminAPI.getAllMeetings,
    });

    // Filter logic
    const filteredMeetings = meetings?.filter((meeting: Meeting) => {
        const matchesSearch =
            meeting.thesis.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            meeting.thesis.studentFirstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            meeting.thesis.studentLastName.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'ALL' || meeting.state === statusFilter;

        return matchesSearch && matchesStatus;
    }) || [];

    const getStatusBadge = (state: MeetingState) => {
        const styles: { [key: string]: string } = {
            JURIES_SELECTED: 'bg-yellow-100 text-yellow-800',
            JURIES_SPECIFIED_TIME: 'bg-purple-100 text-purple-800',
            STUDENT_SPECIFIED_TIME: 'bg-purple-100 text-purple-800',
            SCHEDULED: 'bg-green-100 text-green-800',
            COMPLETED: 'bg-blue-100 text-blue-800',
            CANCELLED: 'bg-red-100 text-red-800',
        };
        return (
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[state] || 'bg-gray-100 text-gray-800'}`}>
                {state.replace(/_/g, ' ')}
            </span>
        );
    };

    const getFormattedDate = (dateString?: string, timePeriod?: string) => {
        if (!dateString) return <span className="text-gray-400 italic">Not scheduled</span>;
        try {
            return (
                <div className="flex flex-col">
                    <span className="font-medium text-gray-900">
                        {format(parseISO(dateString), 'MMM d, yyyy')}
                    </span>
                    <span className="text-xs text-gray-500">{timePeriod}</span>
                </div>
            );
        } catch (e) {
            return <span>Invalid Date</span>;
        }
    };

    if (isLoading) return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>;
    if (error) return <div className="p-8 text-center text-red-600">Failed to load data.</div>;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Defense Meetings</h1>
                    <p className="text-sm text-gray-600 mt-1">Overview of all thesis defenses</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 shadow-sm">
                    Total: {meetings?.length || 0}
                </div>
            </div>

            {/* Filters */}
            <Card className="!p-4">
                <div className="flex flex-col md:flex-row gap-4 justify-between">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search student or thesis..."
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto">
                        {['ALL', MeetingState.JURIES_SELECTED, MeetingState.JURIES_SPECIFIED_TIME,
                            MeetingState.STUDENT_SPECIFIED_TIME, MeetingState.SCHEDULED,
                            MeetingState.COMPLETED, MeetingState.CANCELED].map((status) => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                                    statusFilter === status
                                        ? 'bg-primary-100 text-primary-700 ring-1 ring-primary-500'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                {status === 'ALL' ? 'All' : status.replace(/_/g, ' ')}
                            </button>
                        ))}
                    </div>
                </div>
            </Card>

            {/* Table */}
            <div className="bg-white shadow rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Schedule</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jury</th>
                            <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {filteredMeetings.map((meeting: Meeting) => (
                            <tr key={meeting.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                            <span className="text-sm font-medium text-gray-900">
                                                {meeting.thesis.studentFirstName} {meeting.thesis.studentLastName}
                                            </span>
                                        <span className="text-sm text-gray-500 truncate max-w-xs">{meeting.thesis.title}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(meeting.state)}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center text-sm text-gray-500">
                                        <Calendar className="mr-1.5 h-4 w-4 text-gray-400" />
                                        {getFormattedDate(meeting.selectedTimeSlot?.date, meeting.selectedTimeSlot?.timePeriod)}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <div className="flex items-center">
                                        <Users className="mr-1.5 h-4 w-4 text-gray-400" />
                                        {meeting.juryMembers.length} Members
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => setSelectedMeeting(meeting)}
                                        className="text-primary-600 hover:text-primary-900 p-2 rounded-full hover:bg-primary-50"
                                    >
                                        <ChevronRight className="h-5 w-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Details Modal */}
            {selectedMeeting && (
                <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setSelectedMeeting(null)}></div>

                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="flex justify-between items-start mb-4 border-b border-gray-200 pb-4">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                        Meeting Details
                                    </h3>
                                    <button onClick={() => setSelectedMeeting(null)} className="text-gray-400 hover:text-gray-500">
                                        <X className="h-6 w-6" />
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    {/* Student & Thesis Info */}
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                                            <User className="h-4 w-4 mr-2" /> Student Information
                                        </h4>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <span className="text-gray-500 block">Name</span>
                                                <span className="font-medium">{selectedMeeting.thesis.studentFirstName} {selectedMeeting.thesis.studentLastName}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500 block">Field</span>
                                                <span className="font-medium">{selectedMeeting.thesis.fieldName || 'N/A'}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500 block">Instructor</span>
                                                <span className="font-medium">{selectedMeeting.thesis.instructorFirstName} {selectedMeeting.thesis.instructorLastName}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500 block">Score</span>
                                                <span className="font-medium">
                                                    {selectedMeeting.score !== undefined && selectedMeeting.score !== null
                                                        ? Number(selectedMeeting.score).toFixed(2)
                                                        : '-'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="mt-4 pt-4 border-t border-gray-200">
                                            <h4 className="text-sm font-semibold text-gray-900 mb-1 flex items-center">
                                                <FileText className="h-4 w-4 mr-2" /> Thesis Title
                                            </h4>
                                            <p className="text-sm text-gray-700">{selectedMeeting.thesis.title}</p>
                                        </div>
                                    </div>

                                    {/* Schedule Info */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="border rounded-lg p-4">
                                            <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                                                <Clock className="h-4 w-4 mr-2" /> Timing
                                            </h4>
                                            {selectedMeeting.selectedTimeSlot ? (
                                                <div className="text-sm">
                                                    <p className="font-medium text-green-700">Confirmed</p>
                                                    <p>{format(parseISO(selectedMeeting.selectedTimeSlot.date), 'EEEE, MMMM d, yyyy')}</p>
                                                    <p>{selectedMeeting.selectedTimeSlot.timePeriod}</p>
                                                </div>
                                            ) : (
                                                <p className="text-sm text-yellow-600 italic">Not scheduled yet</p>
                                            )}
                                        </div>

                                        <div className="border rounded-lg p-4">
                                            <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                                                <MapPin className="h-4 w-4 mr-2" /> Location
                                            </h4>
                                            <p className="text-sm">
                                                {selectedMeeting.location || <span className="text-gray-400 italic">Pending assignment</span>}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Jury List */}
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                                            <Users className="h-4 w-4 mr-2" /> Jury Members
                                        </h4>
                                        <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-200">
                                            {selectedMeeting.juryMembers.map((jury) => (
                                                <div key={jury.id} className="p-3 flex justify-between items-center text-sm">
                                                    <span className="font-medium text-gray-900">{jury.firstName} {jury.lastName}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                                    onClick={() => setSelectedMeeting(null)}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
