// src/components/admin/students/StudentTableRow.tsx
import React from 'react';
import { GraduationCap, Mail, Phone, Eye, Edit, Trash2 } from 'lucide-react';
import {Student} from "../../types";

interface StudentTableRowProps {
    student: Student
    onView: () => void;
    onEdit: () => void;
    onDelete: () => void;
}

export const StudentTableRow: React.FC<StudentTableRowProps> = ({
                                                                    student,
                                                                    onView,
                                                                    onEdit,
                                                                    onDelete
                                                                }) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ACTIVE':
                return 'bg-green-100 text-green-800';
            case 'GRADUATED':
                return 'bg-blue-100 text-blue-800';
            case 'SUSPENDED':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <tr className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <GraduationCap className="h-5 w-5 text-primary-600" />
                    </div>
                    <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                            {student.firstName} {student.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                            Student Number: {student.studentNumber}
                        </div>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                    {student.department?.name || 'N/A'}
                </div>
                <div className="text-sm text-gray-500">
                    {student.field?.name || 'N/A'}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center space-x-3">
                    <a
                        href={`mailto:${student.email}`}
                        className="text-gray-500 hover:text-primary-600"
                        title={student.email}
                    >
                        <Mail className="h-4 w-4" />
                    </a>
                    {student.phoneNumber && (
                        <a
                            href={`tel:${student.phoneNumber}`}
                            className="text-gray-500 hover:text-primary-600"
                            title={student.phoneNumber}
                        >
                            <Phone className="h-4 w-4" />
                        </a>
                    )}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(student.isGraduated ? 'GRADUATED' : 'ACTIVE')}`}>
                    {student.isGraduated ? 'Graduated' : 'Active'}
                </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(student.creationDate).toLocaleDateString()}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center justify-end space-x-2">
                    <button
                        onClick={onView}
                        className="text-gray-500 hover:text-primary-600 p-1"
                        title="View Details"
                    >
                        <Eye className="h-4 w-4" />
                    </button>
                    <button
                        onClick={onEdit}
                        className="text-gray-500 hover:text-primary-600 p-1"
                        title="Edit"
                    >
                        <Edit className="h-4 w-4" />
                    </button>
                    <button
                        onClick={onDelete}
                        className="text-gray-500 hover:text-red-600 p-1"
                        title="Delete"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            </td>
        </tr>
    );
};
