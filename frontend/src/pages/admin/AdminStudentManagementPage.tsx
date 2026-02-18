import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {UserPlus, Download, X, Mail, Phone, GraduationCap, Building, BookOpen, User} from 'lucide-react';

// Components
import {Button} from '../../components/common/Button';
import {Card} from '../../components/common/Card';
import {StudentSearchBar} from '../../components/admin/StudentSearchBar';
import {DepartmentFilter} from '../../components/admin/DepartmentFilter';
import {StudentTypeFilter} from '../../components/admin/StudentTypeFilter';
import {StudentTable} from '../../components/admin/StudentTable';

// API
import {adminAPI} from '../../api/admin.api';

// Types
import {Student, DepartmentSummary, StudentType} from '../../types';

// --- Student Detail Modal Component ---
import {useTranslation} from "react-i18next";

interface StudentDetailModalProps {
    student: Student | null;
    isOpen: boolean;
    onClose: () => void;
}

const StudentDetailModal: React.FC<StudentDetailModalProps> = ({student, isOpen, onClose}) => {
    const {t} = useTranslation("admin");
    if (!isOpen || !student) return null;

    const getStudentTypeLabel = (type: StudentType) => {
        switch (type) {
            case StudentType.BACHELOR:
                return 'Bachelor';
            case StudentType.MASTER:
                return 'Master';
            case StudentType.PHD:
                return 'PhD';
            default:
                return 'Unknown';
        }
    };

    const getStudentTypeColor = (type: StudentType) => {
        switch (type) {
            case StudentType.BACHELOR:
                return 'bg-indigo-100 text-indigo-800';
            case StudentType.MASTER:
                return 'bg-purple-100 text-purple-800';
            case StudentType.PHD:
                return 'bg-amber-100 text-amber-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                onClick={onClose}/>


            {/* Modal */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    {/* Header */}
                    <div
                        className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl">
                        <h2 className="text-xl font-semibold text-gray-900">{t("student_details")}</h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors">

                            <X className="h-5 w-5 text-gray-500"/>
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6">
                        {/* Profile Section */}
                        <div className="flex items-center space-x-4">
                            <div className="h-20 w-20 bg-primary-100 rounded-full flex items-center justify-center">
                                <GraduationCap className="h-10 w-10 text-primary-600"/>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900">
                                    {student.firstName} {student.lastName}
                                </h3>
                                <p className="text-gray-500">{t("student_id")}{student.studentNumber}</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStudentTypeColor(student.studentType)}`}>
                                        {getStudentTypeLabel(student.studentType)}
                                    </span>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                        student.isGraduated ?
                                            'bg-blue-100 text-blue-800' :
                                            'bg-green-100 text-green-800'}`
                                    }>
                                        {student.isGraduated ? 'Graduated' : 'Active'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">{t("contact_information")}

                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-white rounded-lg shadow-sm">
                                        <Mail className="h-5 w-5 text-gray-500"/>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">{t("email_1")}</p>
                                        <a
                                            href={`mailto:${student.email}`}
                                            className="text-sm text-primary-600 hover:underline">

                                            {student.email}
                                        </a>
                                    </div>
                                </div>
                                {student.phoneNumber &&
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-white rounded-lg shadow-sm">
                                            <Phone className="h-5 w-5 text-gray-500"/>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">{t("phone")}</p>
                                            <a
                                                href={`tel:${student.phoneNumber}`}
                                                className="text-sm text-gray-900">

                                                {student.phoneNumber}
                                            </a>
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>

                        {/* Academic Information */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">{t("academic_information")}

                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-white rounded-lg shadow-sm">
                                        <Building className="h-5 w-5 text-gray-500"/>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">{t("department")}</p>
                                        <p className="text-sm text-gray-900 font-medium">
                                            {student.department?.name || 'N/A'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-white rounded-lg shadow-sm">
                                        <BookOpen className="h-5 w-5 text-gray-500"/>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">{t("field_of_study")}</p>
                                        <p className="text-sm text-gray-900 font-medium">
                                            {student.field?.name || 'N/A'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-white rounded-lg shadow-sm">
                                        <User className="h-5 w-5 text-gray-500"/>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">{t("instructor")}</p>
                                        <p className="text-sm text-gray-900 font-medium">
                                            {student.instructor ?
                                                `${student.instructor.firstName} ${student.instructor.lastName}` :
                                                'N/A'
                                            }
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-white rounded-lg shadow-sm">
                                        <GraduationCap className="h-5 w-5 text-gray-500"/>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">{t("degree_program")}</p>
                                        <p className="text-sm text-gray-900 font-medium">
                                            {getStudentTypeLabel(student.studentType)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Registration Info */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">{t("registration_details")}

                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-gray-500">{t("registration_date")}</p>
                                    <p className="text-sm text-gray-900 font-medium">
                                        {new Date(student.creationDate).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">{t("student_id_1")}</p>
                                    <p className="text-sm text-gray-900 font-medium">
                                        {student.id}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div
                        className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end rounded-b-xl">
                        <Button variant="secondary" onClick={onClose}>{t("close")}

                        </Button>
                    </div>
                </div>
            </div>
        </div>);

};

// --- Main Component ---
export const AdminStudentManagementPage: React.FC = () => {
    const {t} = useTranslation("admin");
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // --- State Management ---
    const [search, setSearch] = useState<string>('');
    const [selectedDeptId, setSelectedDeptId] = useState<string>('');
    const [selectedStudentType, setSelectedStudentType] = useState<string>('');

    // Modal state for viewing student
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);

    // --- Queries ---

    // 1. Fetch Departments (for the Filter Dropdown)
    const {
        data: departmentsData,
        isLoading: isLoadingDepts
    } = useQuery({
        queryKey: ['departments'],
        queryFn: adminAPI.getDepartments
    });

    // 2. Fetch Students (with Search and Filters)
    const {
        data: studentsResponse,
        isLoading: isLoadingStudents
    } = useQuery({
        queryKey: ['students', search, selectedDeptId, selectedStudentType],
        queryFn: () => adminAPI.getStudents({
            search: search || undefined,
            departmentId: selectedDeptId ? Number(selectedDeptId) : undefined,
            studentType: selectedStudentType || undefined
        })
    });

    // --- Data Extraction ---
    const students: Student[] = Array.isArray(studentsResponse) ?
        studentsResponse :
        studentsResponse?.data || [];

    const departments: DepartmentSummary[] = Array.isArray(departmentsData) ?
        departmentsData :
        departmentsData?.data || [];

    // --- Mutations ---

    const deleteMutation = useMutation({
        mutationFn: (id: number) => adminAPI.deleteStudent(id),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['students']});
            console.log('Student deleted successfully');
        },
        onError: (error) => {
            console.error('Failed to delete student', error);
            alert('Failed to delete student. Please try again.');
        }
    });

    // --- Handlers ---

    const handleViewStudent = (student: Student) => {
        setSelectedStudent(student);
        setIsViewModalOpen(true);
    };

    const handleCloseViewModal = () => {
        setIsViewModalOpen(false);
        setSelectedStudent(null);
    };

    const handleEditStudent = (student: Student) => {
        // Navigate to edit student page with student ID
        navigate(`/admin/edit-student/${student.id}`);
    };

    const handleDeleteStudent = (student: Student) => {
        if (window.confirm(t("are_you_sure_you_want_to_delete_1", {
            firstName: student.firstName,
            lastName: student.lastName
        }))) {
            deleteMutation.mutate(student.id);
        }
    };

    const handleClearFilters = () => {
        setSearch('');
        setSelectedDeptId('');
        setSelectedStudentType('');
    };

    const handleExport = () => {
        if (students.length === 0) {
            alert('No students to export.');
            return;
        }

        const header = ['ID', t("student_number"), t("first_name_1"), t("last_name_1"), t("email_1"), t("department"), t("field"), t("student_type"), t("status")];
        const rows = students.map((s: Student) => [
            s.id,
            s.studentNumber,
            s.firstName,
            s.lastName,
            s.email,
            s.department?.name || 'N/A',
            s.field?.name || 'N/A',
            s.studentType || 'N/A',
            s.isGraduated ? 'Graduated' : 'Active']
        );

        const csvContent = [
            header.join(','),
            ...rows.map((row) => row.join(','))].join('\n');

        const blob = new Blob([csvContent], {type: 'text/csv;charset=utf-8;'});
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', t("studentsexportcsv", {val0: new Date().toISOString().split('T')[0]}));
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const hasActiveFilters = search || selectedDeptId || selectedStudentType;

    // --- Render ---

    return (
        <div className="space-y-6">
            {/* View Student Modal */}
            <StudentDetailModal
                student={selectedStudent}
                isOpen={isViewModalOpen}
                onClose={handleCloseViewModal}/>


            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{t("student_management")}</h1>
                    <p className="text-sm text-gray-600 mt-1">{t("manage_registered_students_track_their_progress_an")}

                    </p>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant="secondary"
                        onClick={handleExport}
                        disabled={students.length === 0 || isLoadingStudents}>

                        <Download className="h-4 w-4 mr-2"/>{t("export_csv")}

                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => navigate('/admin/register-student')}>

                        <UserPlus className="h-4 w-4 mr-2"/>{t("register_student")}

                    </Button>
                </div>
            </div>

            {/* Filter Bar */}
            <Card>
                <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center p-1">
                    <div className="w-full lg:w-2/5">
                        <StudentSearchBar
                            value={search}
                            onChange={setSearch}
                            placeholder={t("search_by_name_email_or_student_id")}/>

                    </div>

                    <div className="w-full lg:w-1/5">
                        <DepartmentFilter
                            value={selectedDeptId}
                            onChange={setSelectedDeptId}
                            departments={departments}/>

                    </div>

                    <div className="w-full lg:w-1/5">
                        <StudentTypeFilter
                            value={selectedStudentType}
                            onChange={setSelectedStudentType}/>

                    </div>

                    {hasActiveFilters &&
                        <div className="w-full lg:w-auto">
                            <button
                                onClick={handleClearFilters}
                                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">{t("clear_filters")}


                            </button>
                        </div>
                    }
                </div>

                {hasActiveFilters &&
                    <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm text-gray-500">{t("active_filters")}</span>

                            {search &&
                                <span
                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">{t("search")}
                                    {search}"
                                    <button onClick={() => setSearch('')}
                                            className="ml-1 hover:text-blue-600">×</button>
                                </span>
                            }

                            {selectedDeptId &&
                                <span
                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">{t("dept")}
                                    {departments.find((d) => d.id.toString() === selectedDeptId)?.name || selectedDeptId}
                                    <button onClick={() => setSelectedDeptId('')}
                                            className="ml-1 hover:text-green-600">×</button>
                                </span>
                            }

                            {selectedStudentType &&
                                <span
                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">{t("type")}
                                    {selectedStudentType}
                                    <button onClick={() => setSelectedStudentType('')}
                                            className="ml-1 hover:text-purple-600">×</button>
                                </span>
                            }
                        </div>
                    </div>
                }
            </Card>

            {/* Results Count */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                    {isLoadingStudents ?
                        'Loading...' :

                        <>{t("showing")}
                            <span
                                className="font-medium">{students.length}</span> student{students.length !== 1 ? 's' : ''}
                            {hasActiveFilters && ' (filtered)'}
                        </>
                    }
                </p>
            </div>

            {/* Data Table */}
            <StudentTable
                students={students}
                loading={isLoadingStudents}
                onViewStudent={handleViewStudent}
                onEditStudent={handleEditStudent}
                onDeleteStudent={handleDeleteStudent}/>

        </div>);

};