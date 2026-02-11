import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UserPlus, Download, X, Mail, Phone, GraduationCap, Building, BookOpen, User } from 'lucide-react';

// Components
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { StudentSearchBar } from '../../components/admin/StudentSearchBar';
import { DepartmentFilter } from '../../components/admin/DepartmentFilter';
import { StudentTypeFilter } from '../../components/admin/StudentTypeFilter';
import { StudentTable } from '../../components/admin/StudentTable';

// API
import { adminAPI } from '../../api/admin.api';

// Types
import { Student, DepartmentSummary, StudentType } from '../../types';

// --- Student Detail Modal Component ---
interface StudentDetailModalProps {
    student: Student | null;
    isOpen: boolean;
    onClose: () => void;
}

const StudentDetailModal: React.FC<StudentDetailModalProps> = ({ student, isOpen, onClose }) => {
    if (!isOpen || !student) return null;

    const getStudentTypeLabel = (type: StudentType) => {
        switch (type) {
            case StudentType.BACHELOR: return 'Bachelor';
            case StudentType.MASTER: return 'Master';
            case StudentType.PHD: return 'PhD';
            default: return 'Unknown';
        }
    };

    const getStudentTypeColor = (type: StudentType) => {
        switch (type) {
            case StudentType.BACHELOR: return 'bg-indigo-100 text-indigo-800';
            case StudentType.MASTER: return 'bg-purple-100 text-purple-800';
            case StudentType.PHD: return 'bg-amber-100 text-amber-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    {/* Header */}
                    <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl">
                        <h2 className="text-xl font-semibold text-gray-900">Student Details</h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X className="h-5 w-5 text-gray-500" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6">
                        {/* Profile Section */}
                        <div className="flex items-center space-x-4">
                            <div className="h-20 w-20 bg-primary-100 rounded-full flex items-center justify-center">
                                <GraduationCap className="h-10 w-10 text-primary-600" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900">
                                    {student.firstName} {student.lastName}
                                </h3>
                                <p className="text-gray-500">Student ID: {student.studentNumber}</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStudentTypeColor(student.studentType)}`}>
                                        {getStudentTypeLabel(student.studentType)}
                                    </span>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                        student.isGraduated
                                            ? 'bg-blue-100 text-blue-800'
                                            : 'bg-green-100 text-green-800'
                                    }`}>
                                        {student.isGraduated ? 'Graduated' : 'Active'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                                Contact Information
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-white rounded-lg shadow-sm">
                                        <Mail className="h-5 w-5 text-gray-500" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Email</p>
                                        <a
                                            href={`mailto:${student.email}`}
                                            className="text-sm text-primary-600 hover:underline"
                                        >
                                            {student.email}
                                        </a>
                                    </div>
                                </div>
                                {student.phoneNumber && (
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-white rounded-lg shadow-sm">
                                            <Phone className="h-5 w-5 text-gray-500" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Phone</p>
                                            <a
                                                href={`tel:${student.phoneNumber}`}
                                                className="text-sm text-gray-900"
                                            >
                                                {student.phoneNumber}
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Academic Information */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                                Academic Information
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-white rounded-lg shadow-sm">
                                        <Building className="h-5 w-5 text-gray-500" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Department</p>
                                        <p className="text-sm text-gray-900 font-medium">
                                            {student.department?.name || 'N/A'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-white rounded-lg shadow-sm">
                                        <BookOpen className="h-5 w-5 text-gray-500" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Field of Study</p>
                                        <p className="text-sm text-gray-900 font-medium">
                                            {student.field?.name || 'N/A'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-white rounded-lg shadow-sm">
                                        <User className="h-5 w-5 text-gray-500" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Instructor</p>
                                        <p className="text-sm text-gray-900 font-medium">
                                            {student.instructor
                                                ? `${student.instructor.firstName} ${student.instructor.lastName}`
                                                : 'N/A'
                                            }
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-white rounded-lg shadow-sm">
                                        <GraduationCap className="h-5 w-5 text-gray-500" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Degree Program</p>
                                        <p className="text-sm text-gray-900 font-medium">
                                            {getStudentTypeLabel(student.studentType)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Registration Info */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                                Registration Details
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-gray-500">Registration Date</p>
                                    <p className="text-sm text-gray-900 font-medium">
                                        {new Date(student.creationDate).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Student ID</p>
                                    <p className="text-sm text-gray-900 font-medium">
                                        {student.id}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end rounded-b-xl">
                        <Button variant="secondary" onClick={onClose}>
                            Close
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Main Component ---
export const StudentManagement: React.FC = () => {
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
        queryFn: adminAPI.getDepartments,
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
            studentType: selectedStudentType || undefined,
        }),
    });

    // --- Data Extraction ---
    const students: Student[] = Array.isArray(studentsResponse)
        ? studentsResponse
        : (studentsResponse?.data || []);

    const departments: DepartmentSummary[] = Array.isArray(departmentsData)
        ? departmentsData
        : (departmentsData?.data || []);

    // --- Mutations ---

    const deleteMutation = useMutation({
        mutationFn: (id: number) => adminAPI.deleteStudent(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['students'] });
            console.log('Student deleted successfully');
        },
        onError: (error) => {
            console.error('Failed to delete student', error);
            alert('Failed to delete student. Please try again.');
        },
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
        if (window.confirm(`Are you sure you want to delete ${student.firstName} ${student.lastName}?`)) {
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

        const header = ['ID', 'Student Number', 'First Name', 'Last Name', 'Email', 'Department', 'Field', 'Student Type', 'Status'];
        const rows = students.map((s: Student) => [
            s.id,
            s.studentNumber,
            s.firstName,
            s.lastName,
            s.email,
            s.department?.name || 'N/A',
            s.field?.name || 'N/A',
            s.studentType || 'N/A',
            s.isGraduated ? 'Graduated' : 'Active',
        ]);

        const csvContent = [
            header.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `students_export_${new Date().toISOString().split('T')[0]}.csv`);
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
                onClose={handleCloseViewModal}
            />

            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Student Management</h1>
                    <p className="text-sm text-gray-600 mt-1">
                        Manage registered students, track their progress, and oversee enrollment.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant="secondary"
                        onClick={handleExport}
                        disabled={students.length === 0 || isLoadingStudents}
                    >
                        <Download className="h-4 w-4 mr-2" />
                        Export CSV
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => navigate('/admin/register-student')}
                    >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Register Student
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
                            placeholder="Search by name, email, or student ID..."
                        />
                    </div>

                    <div className="w-full lg:w-1/5">
                        <DepartmentFilter
                            value={selectedDeptId}
                            onChange={setSelectedDeptId}
                            departments={departments}
                        />
                    </div>

                    <div className="w-full lg:w-1/5">
                        <StudentTypeFilter
                            value={selectedStudentType}
                            onChange={setSelectedStudentType}
                        />
                    </div>

                    {hasActiveFilters && (
                        <div className="w-full lg:w-auto">
                            <button
                                onClick={handleClearFilters}
                                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Clear Filters
                            </button>
                        </div>
                    )}
                </div>

                {hasActiveFilters && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm text-gray-500">Active filters:</span>

                            {search && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    Search: "{search}"
                                    <button onClick={() => setSearch('')} className="ml-1 hover:text-blue-600">×</button>
                                </span>
                            )}

                            {selectedDeptId && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Dept: {departments.find(d => d.id.toString() === selectedDeptId)?.name || selectedDeptId}
                                    <button onClick={() => setSelectedDeptId('')} className="ml-1 hover:text-green-600">×</button>
                                </span>
                            )}

                            {selectedStudentType && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                    Type: {selectedStudentType}
                                    <button onClick={() => setSelectedStudentType('')} className="ml-1 hover:text-purple-600">×</button>
                                </span>
                            )}
                        </div>
                    </div>
                )}
            </Card>

            {/* Results Count */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                    {isLoadingStudents ? (
                        'Loading...'
                    ) : (
                        <>
                            Showing <span className="font-medium">{students.length}</span> student{students.length !== 1 ? 's' : ''}
                            {hasActiveFilters && ' (filtered)'}
                        </>
                    )}
                </p>
            </div>

            {/* Data Table */}
            <StudentTable
                students={students}
                loading={isLoadingStudents}
                onViewStudent={handleViewStudent}
                onEditStudent={handleEditStudent}
                onDeleteStudent={handleDeleteStudent}
            />
        </div>
    );
};
