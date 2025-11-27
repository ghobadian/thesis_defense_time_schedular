import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { adminAPI } from '../../api/admin.api';
import {Field, Professor, StudentType} from '../../types';

export const StudentRegistration: React.FC = () => {
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        password: '',
        studentNumber: '',
        studentType: StudentType.BACHELOR,
        departmentId: '',
        fieldId: '',
        instructorId: '',
    });

    const { data: departments } = useQuery({
        queryKey: ['departments'],
        queryFn: adminAPI.getAllDepartments,
    });

    const { data: fields } = useQuery({
        queryKey: ['fields'],
        queryFn: adminAPI.getAllFields,
    });

    const { data: professors } = useQuery ({
        queryKey: ['professors'],
        queryFn: adminAPI.getAllProfessors,
    });

    const registerMutation = useMutation({
        mutationFn: adminAPI.registerStudent,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['students'] });
            alert('Student registered successfully!');
            // Reset form
            setFormData({
                email: '',
                firstName: '',
                lastName: '',
                phoneNumber: '',
                password: '',
                studentNumber: '',
                studentType: StudentType.BACHELOR,
                departmentId: '',
                fieldId: '',
                instructorId: '',
            });
        },
        onError: (error: any) => {
            alert(error.response?.data?.message || 'Failed to register student');
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        registerMutation.mutate({
            ...formData,
            studentNumber: parseInt(formData.studentNumber),
            departmentId: parseInt(formData.departmentId),
            fieldId: parseInt(formData.fieldId),
            instructorId: parseInt(formData.instructorId),
        });
    };

    return (
        <Card title="Register New Student">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="First Name"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        required
                    />
                    <Input
                        label="Last Name"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        required
                    />
                </div>

                <Input
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                />

                <Input
                    label="Phone Number"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    required
                />

                <Input
                    label="Password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                />

                <Input
                    label="Student Number"
                    type="number"
                    value={formData.studentNumber}
                    onChange={(e) => setFormData({ ...formData, studentNumber: e.target.value })}
                    required
                />

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Student Type
                    </label>
                    <select
                        value={formData.studentType}
                        onChange={(e) => setFormData({ ...formData, studentType: e.target.value as StudentType })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        required
                    >
                        <option value={StudentType.BACHELOR}>Bachelor</option>
                        <option value={StudentType.MASTER}>Master</option>
                        <option value={StudentType.PHD}>PhD</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Department
                    </label>
                    <select
                        value={formData.departmentId}
                        onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        required
                    >
                        <option value="">Select Department</option>
                        {departments?.map((dept: any) => (
                            <option key={dept.id} value={dept.id}>
                                {dept.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Field
                    </label>
                    <select
                        value={formData.fieldId}
                        onChange={(e) => setFormData({ ...formData, fieldId: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        required
                    >
                        <option value="">Select Field</option>
                        {fields?.map((field: Field) => (
                            <option key={field.id} value={field.id}>
                                {field.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Instructor
                    </label>
                    <select
                        value={formData.instructorId}
                        onChange={(e) => setFormData({ ...formData, instructorId: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        required
                    >
                        <option value="">Select Instructor</option>
                        {professors?.map((prof: Professor) => (
                            <option key={prof.id} value={prof.id}>
                                {prof.firstName} {prof.lastName}
                            </option>
                        ))}
                    </select>
                </div>

                <Button type="submit" isLoading={registerMutation.isPending} className="w-full">
                    Register Student
                </Button>
            </form>
        </Card>
    );
};
