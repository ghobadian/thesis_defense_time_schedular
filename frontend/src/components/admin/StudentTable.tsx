// src/components/admin/students/StudentTable.tsx
import React from 'react';
import { StudentTableRow } from './StudentTableRow';
import { Student } from "../../types";

interface StudentTableProps {
    students: Student[];
    loading?: boolean;
    onViewStudent: (student: Student) => void;
    onEditStudent: (student: Student) => void;
    onDeleteStudent: (student: Student) => void;
}

export const StudentTable: React.FC<StudentTableProps> = ({
                                                              students = [],
                                                              loading = false,
                                                              onViewStudent,
                                                              onEditStudent,
                                                              onDeleteStudent
                                                          }) => {
    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-8 text-center text-gray-500">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                    <p className="mt-2">Loading students...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Student
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Department / Field
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Student Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Contact
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Registered
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {students.length > 0 ? (
                        students.map((student) => (
                            <StudentTableRow
                                key={student.id}
                                student={student}
                                onView={() => onViewStudent(student)}
                                onEdit={() => onEditStudent(student)}
                                onDelete={() => onDeleteStudent(student)}
                            />
                        ))
                    ) : (
                        <tr>
                            <td colSpan={7} className="text-center py-8 text-gray-500">
                                No students found
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
