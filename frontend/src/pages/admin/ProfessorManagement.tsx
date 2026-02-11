import React, { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    Users,
    Search,
    Plus,
    Edit2,
    Trash2,
    Loader2,
    Building2,
    Mail,
    Phone,
    BookOpen,
    X,
    Save,
    ChevronDown,
    Shield,
    UserCheck, ClipboardList
} from 'lucide-react';
import { adminAPI } from '../../api/admin.api';
import { useTranslation } from 'react-i18next';
import {Professor, DepartmentSummary, Field, ProfessorRegistrationInput} from '../../types';

// Card component
const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
    <div className={`bg-white rounded-xl border border-gray-200 shadow-sm ${className}`}>
        {children}
    </div>
);

export const ProfessorManagement: React.FC = () => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();

    // State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProfessor, setEditingProfessor] = useState<Professor | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>('');

    // Form State
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        departmentId: '',
        fieldId: '',
        password: '',
        confirmPassword: '',
        manager: false
    });

    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    // --- Data Fetching ---
    const { data: professors = [], isLoading: isLoadingProfessors } = useQuery({
        queryKey: ['professors', searchTerm, selectedDeptFilter],
        queryFn: () => adminAPI.getProfessors({
            search: searchTerm || undefined,
            departmentId: selectedDeptFilter ? parseInt(selectedDeptFilter) : undefined
        })
    });

    const { data: departments = [] } = useQuery({
        queryKey: ['departments'],
        queryFn: adminAPI.getAllDepartments
    });

    const { data: fields = [] } = useQuery({
        queryKey: ['fields'],
        queryFn: adminAPI.getAllFields
    });

    // Filter fields by selected department
    const filteredFields = useMemo(() => {
        if (!formData.departmentId) return [];
        return fields.filter((field: Field) =>
            field.department.id.toString() === formData.departmentId
        );
    }, [fields, formData.departmentId]);

    // --- Mutations ---
    const createProfessorMutation = useMutation({
        mutationFn: async (newProfessor: ProfessorRegistrationInput) => {
            return await adminAPI.registerProfessor([newProfessor]); // API expects array
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['professors'] });
            closeModal();
            alert('Professor created successfully');
        },
        onError: (err: any) => {
            alert(err.response?.data?.message || 'Failed to create professor');
        }
    });

    const updateProfessorMutation = useMutation({
        mutationFn: async (data: { id: number; professor: any }) => {
            return await adminAPI.updateProfessor(data.id, data.professor);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['professors'] });
            closeModal();
            alert('Professor updated successfully');
        },
        onError: (err: any) => {
            alert(err.response?.data?.message || 'Failed to update professor');
        }
    });

    const deleteProfessorMutation = useMutation({
        mutationFn: async (id: number) => {
            return await adminAPI.deleteProfessor(id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['professors'] });
            alert('Professor deleted successfully');
        },
        onError: (err: any) => {
            alert(err.response?.data?.message || 'Failed to delete professor');
        }
    });

    // --- Handlers ---
    const handleOpenModal = (professor?: Professor) => {
        if (professor) {
            setEditingProfessor(professor);
            setFormData({
                firstName: professor.firstName,
                lastName: professor.lastName,
                email: professor.email,
                phoneNumber: professor.phoneNumber || '',
                departmentId: professor.department.id.toString(),
                fieldId: '',
                password: '',
                confirmPassword: '',
                manager: professor.manager
            });
        } else {
            setEditingProfessor(null);
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                phoneNumber: '',
                departmentId: '',
                fieldId: '',
                password: '',
                confirmPassword: '',
                manager: false
            });
        }
        setFormErrors({});
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingProfessor(null);
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            phoneNumber: '',
            departmentId: '',
            fieldId: '',
            password: '',
            confirmPassword: '',
            manager: false
        });
        setFormErrors({});
    };

    const validateForm = (): boolean => {
        const errors: Record<string, string> = {};

        if (!formData.firstName.trim()) errors.firstName = 'First name is required';
        if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
        if (!formData.email.trim()) errors.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.email = 'Invalid email format';
        }
        if (!formData.phoneNumber.trim()) errors.phoneNumber = 'Phone number is required';
        else if (!/^\+?[0-9]{10,15}$/.test(formData.phoneNumber)) {
            errors.phoneNumber = 'Invalid phone number format';
        }
        if (!formData.departmentId) errors.departmentId = 'Department is required';

        if (!editingProfessor) {
            if (!formData.password) errors.password = 'Password is required';
            else if (formData.password.length < 6) {
                errors.password = 'Password must be at least 6 characters';
            }
            if (formData.password !== formData.confirmPassword) {
                errors.confirmPassword = 'Passwords do not match';
            }
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        const payload: any = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phoneNumber: formData.phoneNumber,
            departmentId: parseInt(formData.departmentId),
            fieldId: parseInt(formData.fieldId),
            manager: formData.manager
        };

        if (!editingProfessor) {
            payload.password = formData.password;
        }

        if (editingProfessor) {
            updateProfessorMutation.mutate({ id: editingProfessor.id, professor: payload });
        } else {
            createProfessorMutation.mutate(payload);
        }
    };

    const handleDelete = (professor: Professor) => {
        if (window.confirm(`Are you sure you want to delete ${professor.firstName} ${professor.lastName}? This action cannot be undone.`)) {
            deleteProfessorMutation.mutate(professor.id);
        }
    };

    // Stats
    const stats = useMemo(() => ({
        total: professors.length,
        managers: professors.filter((p: Professor) => p.manager).length,
        regular: professors.filter((p: Professor) => !p.manager).length
    }), [professors]);

    const isLoadingAction = createProfessorMutation.isPending || updateProfessorMutation.isPending;

    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Users className="h-7 w-7 text-purple-600" />
                        {t('users.admin.professors-management')}
                    </h1>
                    <p className="text-gray-500 mt-1">Manage all professors and their information</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-sm"
                >
                    <Plus className="h-5 w-5" />
                    Add Professor
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Total Professors</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                        </div>
                        <div className="p-3 bg-purple-100 rounded-full">
                            <Users className="h-6 w-6 text-purple-600" />
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Managers</p>
                            <p className="text-2xl font-bold text-blue-600">{stats.managers}</p>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-full">
                            <Shield className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Regular Professors</p>
                            <p className="text-2xl font-bold text-green-600">{stats.regular}</p>
                        </div>
                        <div className="p-3 bg-green-100 rounded-full">
                            <UserCheck className="h-6 w-6 text-green-600" />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Filters */}
            <Card className="p-4">
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                        />
                    </div>

                    {/* Department Filter */}
                    <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <select
                            value={selectedDeptFilter}
                            onChange={(e) => setSelectedDeptFilter(e.target.value)}
                            className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none appearance-none bg-white min-w-[180px]"
                        >
                            <option value="">All Departments</option>
                            {departments.map((dept: DepartmentSummary) => (
                                <option key={dept.id} value={dept.id}>
                                    {dept.name}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                </div>
            </Card>

            {/* Professors Table */}
            <Card className="overflow-hidden">
                {isLoadingProfessors ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                        <span className="ml-2 text-gray-600">Loading professors...</span>
                    </div>
                ) : professors.length === 0 ? (
                    <div className="text-center py-12">
                        <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No professors found</p>
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="mt-2 text-purple-600 hover:text-purple-700"
                            >
                                Clear search
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Professor
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Field
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Department
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Contact
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Role
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {professors.map((professor: Professor) => (
                                <tr key={professor.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                                                    <span className="text-purple-600 font-medium">
                                                        {professor.firstName[0]}{professor.lastName[0]}
                                                    </span>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {professor.firstName} {professor.lastName}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    ID: {professor.id}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center text-sm text-gray-800">
                                            <ClipboardList className="h-4 w-4 mr-2 text-gray-400" />
                                            {professor.field?.name ?? '—'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center text-sm text-gray-900">
                                            <Building2 className="h-4 w-4 mr-2 text-gray-400" />
                                            {professor.department.name}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center text-sm text-gray-500">
                                            <Mail className="h-4 w-4 mr-2 text-gray-400" />
                                            {professor.email}
                                        </div>
                                        {professor.phoneNumber && (
                                            <div className="flex items-center text-sm text-gray-500 mt-1">
                                                <Phone className="h-4 w-4 mr-2 text-gray-400" />
                                                {professor.phoneNumber}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                professor.manager
                                                    ? 'bg-blue-100 text-blue-700'
                                                    : 'bg-gray-100 text-gray-700'
                                            }`}>
                                                {professor.manager ? 'Manager' : 'Professor'}
                                            </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleOpenModal(professor)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Edit2 className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(professor)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>

            {/* Create/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                        <div
                            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                            onClick={closeModal}
                        />

                        <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-6 pt-6 pb-4">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                        <Users className="h-5 w-5 text-purple-600" />
                                        {editingProfessor ? 'Edit Professor' : 'Add New Professor'}
                                    </h3>
                                    <button
                                        onClick={closeModal}
                                        className="text-gray-400 hover:text-gray-500 p-1"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {/* Name Fields */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                First Name *
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.firstName}
                                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none ${
                                                    formErrors.firstName ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            />
                                            {formErrors.firstName && (
                                                <p className="text-red-500 text-xs mt-1">{formErrors.firstName}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Last Name *
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.lastName}
                                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none ${
                                                    formErrors.lastName ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            />
                                            {formErrors.lastName && (
                                                <p className="text-red-500 text-xs mt-1">{formErrors.lastName}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none ${
                                                formErrors.email ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        />
                                        {formErrors.email && (
                                            <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
                                        )}
                                    </div>

                                    {/* Phone */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Phone Number *
                                        </label>
                                        <input
                                            type="tel"
                                            value={formData.phoneNumber}
                                            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                            placeholder="+989123456789"
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none ${
                                                formErrors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        />
                                        {formErrors.phoneNumber && (
                                            <p className="text-red-500 text-xs mt-1">{formErrors.phoneNumber}</p>
                                        )}
                                    </div>

                                    {/* Department */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Department *
                                        </label>
                                        <select
                                            value={formData.departmentId}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                departmentId: e.target.value,
                                                fieldId: '' // Reset field when department changes
                                            })}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white ${
                                                formErrors.departmentId ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        >
                                            <option value="">Select Department</option>
                                            {departments.map((dept: DepartmentSummary) => (
                                                <option key={dept.id} value={dept.id}>
                                                    {dept.name}
                                                </option>
                                            ))}
                                        </select>
                                        {formErrors.departmentId && (
                                            <p className="text-red-500 text-xs mt-1">{formErrors.departmentId}</p>
                                        )}
                                    </div>

                                    {/* Field */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Field
                                        </label>
                                        <select
                                            value={formData.fieldId}
                                            onChange={(e) => setFormData({ ...formData, fieldId: e.target.value })}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white ${
                                                formErrors.fieldId ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            disabled={!formData.departmentId}
                                        >
                                            <option value="">Select Field</option>
                                            {filteredFields.map((field: Field) => (
                                                <option key={field.id} value={field.id}>
                                                    {field.name}
                                                </option>
                                            ))}
                                        </select>
                                        {formErrors.fieldId && (
                                            <p className="text-red-500 text-xs mt-1">{formErrors.fieldId}</p>
                                        )}
                                    </div>

                                    {/* Manager Toggle */}
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <input
                                            type="checkbox"
                                            id="isManager"
                                            checked={formData.manager}
                                            onChange={(e) => setFormData({ ...formData, manager: e.target.checked })}
                                            className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                                        />
                                        <label htmlFor="isManager" className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                                            <Shield className="h-4 w-4 text-blue-600" />
                                            Assign as Department Manager
                                        </label>
                                    </div>

                                    {/* Password Fields (Only for new professors) */}
                                    {!editingProfessor && (
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Password *
                                                </label>
                                                <input
                                                    type="password"
                                                    value={formData.password}
                                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none ${
                                                        formErrors.password ? 'border-red-500' : 'border-gray-300'
                                                    }`}
                                                />
                                                {formErrors.password && (
                                                    <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Confirm Password *
                                                </label>
                                                <input
                                                    type="password"
                                                    value={formData.confirmPassword}
                                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none ${
                                                        formErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                                                    }`}
                                                />
                                                {formErrors.confirmPassword && (
                                                    <p className="text-red-500 text-xs mt-1">{formErrors.confirmPassword}</p>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="pt-4 flex gap-3">
                                        <button
                                            type="button"
                                            onClick={closeModal}
                                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isLoadingAction}
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isLoadingAction ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <Save className="h-4 w-4" />
                                            )}
                                            {editingProfessor ? 'Save Changes' : 'Create Professor'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfessorManagement;
