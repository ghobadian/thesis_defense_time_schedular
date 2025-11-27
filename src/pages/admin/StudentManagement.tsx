import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UserPlus, Download, FileDown } from 'lucide-react';

// Components
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { StudentSearchBar } from '../../components/admin/StudentSearchBar';
import { DepartmentFilter } from '../../components/admin/DepartmentFilter';
import { StudentTable } from '../../components/admin/StudentTable';

// API
import { adminAPI } from '../../api/admin.api';

// Types
import { Student, DepartmentSummary } from '../../types';

export const StudentManagement: React.FC = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // --- State Management ---
    const [search, setSearch] = useState<string>('');
    // We keep departmentId as string in state to handle the empty "" (All) case easily with select inputs,
    // but we convert it to number before sending to API.
    const [selectedDeptId, setSelectedDeptId] = useState<string>('');

    // --- Queries ---

    // 1. Fetch Departments (for the Filter Dropdown)
    const {
        data: departmentsData,
        isLoading: isLoadingDepts
    } = useQuery({
        queryKey: ['departments'],
        queryFn: adminAPI.getDepartments,
    });

    // 2. Fetch Students (with Search and Filter)
    const {
        data: studentsResponse,
        isLoading: isLoadingStudents
    } = useQuery({
        // We include search and selectedDeptId in the key so it auto-refetches when they change
        queryKey: ['students', search, selectedDeptId],
        queryFn: () => adminAPI.getStudents({
            search: search || undefined,
            // Convert string state to number for API, or undefined if empty
            departmentId: selectedDeptId ? Number(selectedDeptId) : undefined,
        }),
    });

    // --- Data Extraction ---
    // Handle cases where API might return array directly or inside a .data property
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
            // Ideally use a toast notification here
            console.log('Student deleted successfully');
        },
        onError: (error) => {
            console.error('Failed to delete student', error);
            alert('Failed to delete student. Please try again.');
        },
    });

    // --- Handlers ---

    const handleViewStudent = (student: Student) => {
        // Example: navigate to a detail page
        // navigate(`/admin/students/${student.id}`);
        console.log('View student:', student.id);
    };

    const handleEditStudent = (student: Student) => {
        navigate(`/admin/edit-student/${student.id}`);
    };

    const handleDeleteStudent = (student: Student) => {
        if (window.confirm(`Are you sure you want to delete ${student.firstName} ${student.lastName}?`)) {
            deleteMutation.mutate(student.id);
        }
    };

    const handleExport = () => {
        if (students.length === 0) {
            alert('No students to export.');
            return;
        }

        // Simple CSV Export Logic
        const header = ['ID', 'Student Number', 'First Name', 'Last Name', 'Email', 'Department'];
        const rows = students.map((s: Student) => [
            s.id,
            s.studentNumber,
            s.firstName,
            s.lastName,
            s.email,
            s.department?.name || 'N/A',
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

    // --- Render ---

    return (
        <div className="space-y-6">
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
                <div className="flex flex-col md:flex-row gap-4 items-center p-1">
                    <div className="w-full md:w-1/2">
                        <StudentSearchBar
                            value={search}
                            onChange={setSearch}
                            placeholder="Search by name, email, or student ID..."
                        />
                    </div>
                    <div className="w-full md:w-1/3">
                        <DepartmentFilter
                            value={selectedDeptId}
                            onChange={(val) => setSelectedDeptId(val)}
                            departments={departments}
                        />
                    </div>
                </div>
            </Card>

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
