import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { adminAPI } from '../../api/admin.api';
import {Field, Professor, StudentType} from '../../types';

interface ValidationErrors {
    email?: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    password?: string;
    studentNumber?: string;
    departmentId?: string;
    fieldId?: string;
    instructorId?: string;
}

const validators = {
    email: (value: string): string | undefined => {
        if (!value.trim()) return 'Email is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Invalid email format';
        return undefined;
    },
    firstName: (value: string): string | undefined => {
        if (!value.trim()) return 'First name is required';
        if (value.trim().length < 2) return 'Min 2 characters';
        return undefined;
    },
    lastName: (value: string): string | undefined => {
        if (!value.trim()) return 'Last name is required';
        if (value.trim().length < 2) return 'Min 2 characters';
        return undefined;
    },
    phoneNumber: (value: string): string | undefined => {
        if (!value.trim()) return 'Phone number is required';
        if (!/^\+?[0-9]{10,15}$/.test(value.replace(/[\s\-]/g, ''))) {
            return 'Invalid phone (10-15 digits)';
        }
        return undefined;
    },
    password: (value: string): string | undefined => {
        if (!value) return 'Password is required';
        if (value.length < 8) return 'Min 8 characters';
        if (!/[A-Z]/.test(value)) return 'Need uppercase letter';
        if (!/[a-z]/.test(value)) return 'Need lowercase letter';
        if (!/[0-9]/.test(value)) return 'Need a number';
        return undefined;
    },
    studentNumber: (value: string): string | undefined => {
        if (!value.trim()) return 'Student number is required';
        if (!/^\d{5,15}$/.test(value)) return 'Must be 5-15 digits';
        return undefined;
    },
    departmentId: (value: string): string | undefined => {
        if (!value) return 'Department is required';
        return undefined;
    },
    fieldId: (value: string): string | undefined => {
        if (!value) return 'Field is required';
        return undefined;
    },
    instructorId: (value: string): string | undefined => {
        if (!value) return 'Instructor is required';
        return undefined;
    },
};

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
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});

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
            setErrors({});    // Add this
            setTouched({});   // Add this
        },
        onError: (error: any) => {
            alert(error.response?.data?.message || 'Failed to register student');
        },
    });

    // Validate single field
    const validateField = (name: keyof ValidationErrors, value: string): string | undefined => {
        const validator = validators[name];
        return validator ? validator(value) : undefined;
    };

// Validate all fields
    const validateForm = (): ValidationErrors => {
        const newErrors: ValidationErrors = {};
        (Object.keys(validators) as Array<keyof ValidationErrors>).forEach((key) => {
            const error = validateField(key, formData[key]);
            if (error) newErrors[key] = error;
        });
        return newErrors;
    };

// Handle blur - mark touched and validate
    const handleBlur = (name: keyof ValidationErrors) => {
        setTouched(prev => ({ ...prev, [name]: true }));
        const error = validateField(name, formData[name]);
        setErrors(prev => ({ ...prev, [name]: error }));
    };

// Handle change with validation
    const handleChange = (name: keyof typeof formData, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
        if (touched[name]) {
            const error = validateField(name as keyof ValidationErrors, value);
            setErrors(prev => ({ ...prev, [name]: error }));
        }
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Mark all as touched
        const allTouched = Object.keys(validators).reduce((acc, key) => {
            acc[key] = true;
            return acc;
        }, {} as Record<string, boolean>);
        setTouched(allTouched);

        // Validate
        const validationErrors = validateForm();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            return; // Stop if errors exist
        }

        registerMutation.mutate([{
            ...formData,
            studentNumber: parseInt(formData.studentNumber),
            departmentId: parseInt(formData.departmentId),
            fieldId: parseInt(formData.fieldId),
            instructorId: parseInt(formData.instructorId),
        }]);
    };

    const ErrorMessage = ({ error }: { error?: string }) => (
        error ? <p className="mt-1 text-sm text-red-600">{error}</p> : null
    );

    return (
        <Card title="Register New Student">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="First Name"
                        value={formData.firstName}
                        onChange={(e) => handleChange('firstName', e.target.value)}
                        onBlur={() => handleBlur('firstName')}
                        required
                    />
                    {touched.firstName && <ErrorMessage error={errors.firstName} />}
                    <Input
                        label="Last Name"
                        value={formData.lastName}
                        onChange={(e) => handleChange('lastName', e.target.value)}
                        onBlur={() => handleBlur('lastName')}
                        required
                    />
                    {touched.lastName && <ErrorMessage error={errors.lastName} />}

                </div>

                <Input
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    onBlur={() => handleBlur('email')}
                    required
                />
                {touched.email && <ErrorMessage error={errors.email} />}


                <Input
                    label="Phone Number"
                    value={formData.phoneNumber}
                    onChange={(e) => handleChange('phoneNumber', e.target.value)}
                    onBlur={() => handleBlur('phoneNumber')}
                    required
                />
                {touched.phoneNumber && <ErrorMessage error={errors.phoneNumber} />}

                <Input
                    label="Password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    onBlur={() => handleBlur('password')}
                    required
                />
                {touched.password && <ErrorMessage error={errors.password} />}

                <Input
                    label="Student Number"
                    type="text"
                    value={formData.studentNumber}
                    onChange={(e) => handleChange('studentNumber', e.target.value)}
                    onBlur={() => handleBlur('studentNumber')}
                    required
                />
                {touched.studentNumber && <ErrorMessage error={errors.studentNumber} />}

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
