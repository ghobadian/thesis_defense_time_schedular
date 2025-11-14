import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminAPI } from '../../api/admin.api';
import { Button } from '../../components/common/Button';  // Uses your existing version
import { Card } from '../../components/common/Card';
import { StudentSearchBar } from '../../components/admin/StudentSearchBar';
import { DepartmentFilter } from '../../components/admin/DepartmentFilter';
import { StudentTable } from '../../components/admin/StudentTable';
import { UserPlus, Download } from 'lucide-react';
import {Student} from "../../types";

export const StudentManagement: React.FC = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [search, setSearch] = useState('');
    const [department, setDepartment] = useState('');

    // -------------------------------
    // ✅ Mock Data (for fallback)
    // -------------------------------
    const mockStudents = [
        {
            id: '1',
            studentId: 'STU-001',
            firstName: 'Ali',
            lastName: 'Rezaei',
            email: 'ali@example.com',
            phone: '09123456789',
            department: { name: 'Computer Science' },
            field: { name: 'Software Engineering' },
            status: 'ACTIVE',
            createdAt: new Date().toISOString()
        },
        {
            id: '2',
            studentId: 'STU-002',
            firstName: 'Sara',
            lastName: 'Ahmadi',
            email: 'sara@example.com',
            department: { name: 'Computer Science' },
            field: { name: 'AI' },
            status: 'GRADUATED',
            createdAt: new Date().toISOString()
        }
    ];

    // -------------------------------
    // ✅ Queries: Students + Departments
    // -------------------------------
    const { data: studentsData, isLoading, error } = useQuery({
        queryKey: ['students', search, department],
        queryFn: () => adminAPI.getStudents({ search, department }),
        retry: false,
    });

    const { data: departments } = useQuery({
        queryKey: ['departments'],
        queryFn: adminAPI.getDepartments,
        retry: false,
    });

    // -------------------------------
    // ✅ Mutations
    // -------------------------------
    const deleteMutation = useMutation({
        mutationFn: (id: string) => adminAPI.deleteStudent(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['students'] });
            alert('Student deleted successfully');
        },
        onError: () => {
            alert('Error deleting student (using mock data fallback)');
        },
    });

    // -------------------------------
    // ✅ Data Mapping + Filtering
    // -------------------------------
    const students = error ? mockStudents : (studentsData?.data || []);
    const filteredStudents = students.filter((s: Student) => {
        const term: string = search.toLowerCase();
        const matchesSearch: boolean =
            !search ||
            s.firstName.toLowerCase().includes(term) ||
            s.lastName.toLowerCase().includes(term) ||
            s.email.toLowerCase().includes(term) ||
            String(s.id) === term;

        const matchesDepartment = !department || s.department?.name === department;
        return matchesSearch && matchesDepartment;
    });

    // -------------------------------
    // ✅ CSV Export
    // -------------------------------
    const handleExport = () => {
        const csvData = filteredStudents.map(
            (s: Student) => `${s.id},${s.firstName},${s.lastName},${s.email},${s.enabled}`
        ).join('\n');

        const blob = new Blob(
            [`ID,First Name,Last Name,Email,Status\n${csvData}`],
            { type: 'text/csv' }
        );
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'students.csv';
        link.click();
    };

    // -------------------------------
    // ✅ Handlers
    // -------------------------------
    const handleViewStudent = (student: any) => {
        alert(`Viewing details for ${student.firstName} ${student.lastName}`);
        // open modal later (StudentDetailModal)
    };

    const handleEditStudent = (student: any) => {
        navigate(`/admin/edit-student/${student.id}`);
    };

    const handleDeleteStudent = (student: any) => {
        if (window.confirm(`Delete ${student.firstName} ${student.lastName}?`)) {
            deleteMutation.mutate(student.id);
        }
    };

    // -------------------------------
    // ✅ UI Rendering
    // -------------------------------
    return (
        <div className="space-y-6">
            {/* --- Header --- */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Student Management</h1>
                    <p className="text-sm text-gray-600 mt-1">
                        Manage registered students, edit details, or export data
                    </p>
                </div>
                <div className="flex space-x-3">
                    <Button
                        variant="secondary"
                        size="md"
                        onClick={handleExport}
                    >
                        <Download className="h-4 w-4 mr-2" /> Export
                    </Button>
                    <Button
                        variant="primary"
                        size="md"
                        onClick={() => navigate('/admin/register-student')}
                    >
                        <UserPlus className="h-4 w-4 mr-2" /> Add Student
                    </Button>
                </div>
            </div>

            {/* --- Filters --- */}
            <Card>
                <div className="flex flex-col md:flex-row gap-4 items-center">
                    <StudentSearchBar
                        value={search}
                        onChange={setSearch}
                    />
                    <DepartmentFilter
                        value={department}
                        onChange={setDepartment}
                        departments={departments?.data || []}
                    />
                </div>
            </Card>

            {/* --- Table --- */}
            <StudentTable
                students={filteredStudents}
                loading={isLoading}
                onViewStudent={handleViewStudent}
                onEditStudent={handleEditStudent}
                onDeleteStudent={handleDeleteStudent}
            />
        </div>
    );
};
