// src/components/admin/students/StudentTableRow.tsx
import React from 'react';
import {GraduationCap, Mail, Phone, Eye, Edit, Trash2} from 'lucide-react';
import {Student, StudentType} from "../../types";
import {useTranslation} from "react-i18next";

interface StudentTableRowProps {
    student: Student;
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
    const {t} = useTranslation("admin");
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

    // Helper function to get student type display info
    const getStudentTypeInfo = (type: StudentType) => {
        switch (type) {
            case StudentType.BACHELOR:
                return {
                    label: t("bachelor"),
                    color: 'bg-indigo-100 text-indigo-800',
                    shortLabel: t("bsc")
                };
            case StudentType.MASTER:
                return {
                    label: t("master"),
                    color: 'bg-purple-100 text-purple-800',
                    shortLabel: t("msc")
                };
            case StudentType.PHD:
                return {
                    label: t("phd"),
                    color: 'bg-amber-100 text-amber-800',
                    shortLabel: t("phd")
                };
            default:
                return {
                    label: t("unknown"),
                    color: 'bg-gray-100 text-gray-800',
                    shortLabel: t("na")
                };
        }
    };

    const studentTypeInfo = getStudentTypeInfo(student.studentType);

    return (
        <tr className="hover:bg-gray-50">
            {/* Student Info */}
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                    <div
                        className="flex-shrink-0 h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <GraduationCap className="h-5 w-5 text-primary-600"/>
                    </div>
                    <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                            {student.firstName} {student.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{t("student_number")}
                            {student.studentNumber}
                        </div>
                    </div>
                </div>
            </td>

            {/* Department / Field */}
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                    {student.department?.name || 'N/A'}
                </div>
                <div className="text-sm text-gray-500">
                    {student.field?.name || 'N/A'}
                </div>
            </td>

            {/* Student Type - NEW COLUMN */}
            <td className="px-6 py-4 whitespace-nowrap">
                <span
                    className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${studentTypeInfo.color}`}>
                    {studentTypeInfo.label}
                </span>
            </td>

            {/* Contact */}
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center space-x-3">
                    <a
                        href={`mailto:${student.email}`}
                        className="text-gray-500 hover:text-primary-600"
                        title={student.email}>

                        <Mail className="h-4 w-4"/>
                    </a>
                    {student.phoneNumber &&
                        <a
                            href={`tel:${student.phoneNumber}`}
                            className="text-gray-500 hover:text-primary-600"
                            title={student.phoneNumber}>

                            <Phone className="h-4 w-4"/>
                        </a>
                    }
                </div>
            </td>

            {/* Status */}
            <td className="px-6 py-4 whitespace-nowrap">
                <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(student.isGraduated ? 'GRADUATED' : 'ACTIVE')}`}>
                    {student.isGraduated ? 'Graduated' : 'Active'}
                </span>
            </td>

            {/* Registered Date */}
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(student.creationDate).toLocaleDateString()}
            </td>

            {/* Actions */}
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center justify-end space-x-2">
                    <button
                        onClick={onView}
                        className="text-gray-500 hover:text-primary-600 p-1"
                        title={t("view_details")}>

                        <Eye className="h-4 w-4"/>
                    </button>
                    <button
                        onClick={onEdit}
                        className="text-gray-500 hover:text-primary-600 p-1"
                        title={t("edit")}>

                        <Edit className="h-4 w-4"/>
                    </button>
                    <button
                        onClick={onDelete}
                        className="text-gray-500 hover:text-red-600 p-1"
                        title={t("delete")}>

                        <Trash2 className="h-4 w-4"/>
                    </button>
                </div>
            </td>
        </tr>);

};