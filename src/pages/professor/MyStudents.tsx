import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { professorAPI } from '../../api/professor.api';
import { Card } from '../../components/common/Card';
import { User, Mail, Phone, GraduationCap, FileText } from 'lucide-react';

interface Student {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    studentNumber: string;
    field: {
        id: number;
        name: string;
    };
    department: {
        id: number;
        name: string;
    };
    thesisForms?: Array<{
        id: number;
        title: string;
        state: string;
    }>;
}

export const MyStudents: React.FC = () => {
    const { data: students, isLoading, error } = useQuery<Student[]>({
        queryKey: ['myStudents'],
        queryFn: professorAPI.getMySupervisedStudents,
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-600">Loading students...</div>
            </div>
        );
    }

    if (error) {
        return (
            <Card>
                <p className="text-red-600 text-center py-8">
                    Failed to load students. Please try again later.
                </p>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">My Students</h1>
                <div className="text-sm text-gray-600">
                    Total: <span className="font-semibold">{students?.length || 0}</span> students
                </div>
            </div>

            {!students || students.length === 0 ? (
                <Card>
                    <div className="text-center py-12">
                        <GraduationCap className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 text-lg">No students assigned yet</p>
                        <p className="text-gray-500 text-sm mt-2">
                            Students will appear here when they are assigned to you as supervisor
                        </p>
                    </div>
                </Card>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {students.map((student) => (
                        <Card key={student.id} className="hover:shadow-lg transition-shadow">
                            <div className="space-y-4">
                                {/* Student Header */}
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="bg-primary-100 rounded-full p-3">
                                            <User className="h-6 w-6 text-primary-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-900">
                                                {student.firstName} {student.lastName}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                ID: {student.studentNumber}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Student Info */}
                                <div className="space-y-2 pt-4 border-t border-gray-200">
                                    <div className="flex items-center space-x-2 text-sm">
                                        <Mail className="h-4 w-4 text-gray-400" />
                                        <span className="text-gray-600">{student.email}</span>
                                    </div>

                                    {student.phoneNumber && (
                                        <div className="flex items-center space-x-2 text-sm">
                                            <Phone className="h-4 w-4 text-gray-400" />
                                            <span className="text-gray-600">{student.phoneNumber}</span>
                                        </div>
                                    )}

                                    <div className="flex items-center space-x-2 text-sm">
                                        <GraduationCap className="h-4 w-4 text-gray-400" />
                                        <span className="text-gray-600">
                                            {student.field.name} - {student.department.name}
                                        </span>
                                    </div>
                                </div>

                                {/* Thesis Forms Summary */}
                                {student.thesisForms && student.thesisForms.length > 0 && (
                                    <div className="pt-4 border-t border-gray-200">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <FileText className="h-4 w-4 text-gray-400" />
                                            <span className="text-sm font-medium text-gray-700">
                                                Thesis Forms ({student.thesisForms.length})
                                            </span>
                                        </div>
                                        <div className="space-y-1">
                                            {student.thesisForms.map((form) => (
                                                <div
                                                    key={form.id}
                                                    className="text-xs bg-gray-50 rounded px-2 py-1 flex items-center justify-between"
                                                >
                                                    <span className="text-gray-700 truncate">{form.title}</span>
                                                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${
                                                        form.state === 'SUBMITTED' ? 'bg-yellow-100 text-yellow-800' :
                                                            form.state.includes('APPROVED') ? 'bg-green-100 text-green-800' :
                                                                'bg-red-100 text-red-800'
                                                    }`}>
                                                        {form.state.replace(/_/g, ' ')}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};
