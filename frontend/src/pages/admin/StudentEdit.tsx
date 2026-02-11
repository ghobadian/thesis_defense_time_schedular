import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { adminAPI } from "../../api/admin.api";
import {Student, StudentType, Field, Professor, StudentUpdateRequest} from "../../types";
import { Button } from "../../components/common/Button";
import { Input } from "../../components/common/Input";
import { Card } from "../../components/common/Card";

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
    password: (value: string, isEdit: boolean): string | undefined => {
        // Password is optional when editing (only required if user wants to change it)
        if (!value && isEdit) return undefined;
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

export default function StudentEdit() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
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
    const [isFormInitialized, setIsFormInitialized] = useState(false);

    // Fetch student data
    const { data: student, isLoading: isLoadingStudent } = useQuery({
        queryKey: ["student", id],
        queryFn: () => adminAPI.getStudentById(Number(id)),
        enabled: !!id,
    });

    // Fetch departments
    const { data: departments } = useQuery({
        queryKey: ['departments'],
        queryFn: adminAPI.getAllDepartments,
    });

    // Fetch fields
    const { data: fields } = useQuery({
        queryKey: ['fields'],
        queryFn: adminAPI.getAllFields,
    });

    // Fetch professors
    const { data: professors } = useQuery({
        queryKey: ['professors'],
        queryFn: adminAPI.getAllProfessors,
    });

    // Populate form when student data loads
    useEffect(() => {
        if (student && !isFormInitialized) {
            setFormData({
                firstName: student.firstName || '',
                lastName: student.lastName || '',
                phoneNumber: student.phoneNumber || '',
                studentNumber: String(student.studentNumber) || '',
                studentType: student.studentType || StudentType.BACHELOR,
                departmentId: String(student.department?.id) || '',
                fieldId: String(student.field?.id) || '',
                instructorId: String(student.instructor?.id) || '',
                email: student.email || '',
                password: '' // Password is empty - user only fills if they want to change it
            });
            setIsFormInitialized(true);
        }
    }, [student, isFormInitialized]);

    // Update mutation - uses StudentRegistration type
    const updateMutation = useMutation({
        mutationFn: (data: StudentUpdateRequest) => adminAPI.updateStudent(Number(id), data),
        onSuccess: () => {
            alert("Student updated successfully!");
            queryClient.invalidateQueries({ queryKey: ["students"] });
            queryClient.invalidateQueries({ queryKey: ["student", id] });
            navigate("/admin/students");
        },
        onError: (error: any) => {
            alert(error.response?.data?.message || "Failed to update student");
        }
    });

    // Validation
    const validateField = (name: keyof ValidationErrors, value: string): string | undefined => {
        if (name === 'password') {
            return validators.password(value, true); // true = isEdit mode
        }
        const validator = validators[name];
        return validator ? validator(value) : undefined;
    };

    const validateForm = (): ValidationErrors => {
        const newErrors: ValidationErrors = {};
        (Object.keys(validators) as Array<keyof ValidationErrors>).forEach((key) => {
            const error = validateField(key, formData[key]);
            if (error) newErrors[key] = error;
        });
        return newErrors;
    };

    const handleBlur = (name: keyof ValidationErrors) => {
        setTouched(prev => ({ ...prev, [name]: true }));
        const error = validateField(name, formData[name]);
        setErrors(prev => ({ ...prev, [name]: error }));
    };

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
            return;
        }

        // Build StudentRegistration object
        const updateData: StudentUpdateRequest = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            phoneNumber: formData.phoneNumber,
            studentNumber: parseInt(formData.studentNumber),
            studentType: formData.studentType,
            departmentId: parseInt(formData.departmentId),
            fieldId: parseInt(formData.fieldId),
            instructorId: parseInt(formData.instructorId),
            password: formData.password,
        };

        updateMutation.mutate(updateData);
    };

    const ErrorMessage = ({ error }: { error?: string }) => (
        error ? <p className="mt-1 text-sm text-red-600">{error}</p> : null
    );

    // Loading state
    if (isLoadingStudent) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center space-y-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
                    <p className="text-gray-600">Loading student data...</p>
                </div>
            </div>
        );
    }

    // Not found state
    if (!student && !isLoadingStudent) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <p className="text-red-600 mb-4">Student not found</p>
                    <Button variant="secondary" onClick={() => navigate('/admin/students')}>
                        Back to Students
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center space-x-4">
                <button
                    onClick={() => navigate('/admin/students')}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <ArrowLeft className="h-5 w-5 text-gray-600" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Edit Student</h1>
                    <p className="text-sm text-gray-600">
                        Editing: {student?.firstName} {student?.lastName} (#{student?.studentNumber})
                    </p>
                </div>
            </div>

            {/* Form */}
            <Card title="Student Information">
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Input
                                label="First Name"
                                value={formData.firstName}
                                onChange={(e) => handleChange('firstName', e.target.value)}
                                onBlur={() => handleBlur('firstName')}
                                required
                            />
                            {touched.firstName && <ErrorMessage error={errors.firstName} />}
                        </div>
                        <div>
                            <Input
                                label="Last Name"
                                value={formData.lastName}
                                onChange={(e) => handleChange('lastName', e.target.value)}
                                onBlur={() => handleBlur('lastName')}
                                required
                            />
                            {touched.lastName && <ErrorMessage error={errors.lastName} />}
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <Input
                            label="Email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleChange('email', e.target.value)}
                            onBlur={() => handleBlur('email')}
                            required
                        />
                        {touched.email && <ErrorMessage error={errors.email} />}
                    </div>

                    {/* Phone */}
                    <div>
                        <Input
                            label="Phone Number"
                            value={formData.phoneNumber}
                            onChange={(e) => handleChange('phoneNumber', e.target.value)}
                            onBlur={() => handleBlur('phoneNumber')}
                            required
                        />
                        {touched.phoneNumber && <ErrorMessage error={errors.phoneNumber} />}
                    </div>

                    {/* Password - Optional for edit */}
                    <div>
                        <Input
                            label="Password (leave empty to keep current)"
                            type="password"
                            value={formData.password}
                            onChange={(e) => handleChange('password', e.target.value)}
                            onBlur={() => handleBlur('password')}
                            placeholder="Enter new password only if you want to change it"
                        />
                        {touched.password && <ErrorMessage error={errors.password} />}
                    </div>

                    {/* Student Number */}
                    <div>
                        <Input
                            label="Student Number"
                            type="text"
                            value={formData.studentNumber}
                            onChange={(e) => handleChange('studentNumber', e.target.value)}
                            onBlur={() => handleBlur('studentNumber')}
                            required
                        />
                        {touched.studentNumber && <ErrorMessage error={errors.studentNumber} />}
                    </div>

                    {/* Department */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Department
                        </label>
                        <select
                            value={formData.departmentId}
                            onChange={(e) => handleChange('departmentId', e.target.value)}
                            onBlur={() => handleBlur('departmentId')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            required
                        >
                            <option value="">Select Department</option>
                            {departments?.map((dept: any) => (
                                <option key={dept.id} value={dept.id}>
                                    {dept.name}
                                </option>
                            ))}
                        </select>
                        {touched.departmentId && <ErrorMessage error={errors.departmentId} />}
                    </div>

                    {/* Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Field
                        </label>
                        <select
                            value={formData.fieldId}
                            onChange={(e) => handleChange('fieldId', e.target.value)}
                            onBlur={() => handleBlur('fieldId')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            required
                        >
                            <option value="">Select Field</option>
                            {fields?.map((field: Field) => (
                                <option key={field.id} value={field.id}>
                                    {field.name}
                                </option>
                            ))}
                        </select>
                        {touched.fieldId && <ErrorMessage error={errors.fieldId} />}
                    </div>

                    {/* Instructor */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Instructor
                        </label>
                        <select
                            value={formData.instructorId}
                            onChange={(e) => handleChange('instructorId', e.target.value)}
                            onBlur={() => handleBlur('instructorId')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            required
                        >
                            <option value="">Select Instructor</option>
                            {professors?.map((prof: Professor) => (
                                <option key={prof.id} value={prof.id}>
                                    {prof.firstName} {prof.lastName}
                                </option>
                            ))}
                        </select>
                        {touched.instructorId && <ErrorMessage error={errors.instructorId} />}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => navigate('/admin/students')}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            isLoading={updateMutation.isPending}
                        >
                            <Save className="h-4 w-4 mr-2" />
                            Save Changes
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
