// src/pages/admin/Departments.tsx
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminAPI } from '../../api/admin.api';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import {
    Building2,
    Search,
    Plus,
    Edit2,
    Trash2,
    AlertTriangle
} from 'lucide-react';
import { format } from 'date-fns';
import {DepartmentSummary} from "../../types";

export const Departments: React.FC = () => {
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState('');

    // Modal States
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState<DepartmentSummary | null>(null);
    const [formData, setFormData] = useState({ name: '' });

    // --- Queries & Mutations ---

    const { data: departments, isLoading } = useQuery({
        queryKey: ['departments'],
        queryFn: adminAPI.getAllDepartments,
    });

    const createMutation = useMutation({
        mutationFn: adminAPI.createDepartment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['departments'] });
            closeFormModal();
        },
    });

    const updateMutation = useMutation({
        mutationFn: (data: { id: number; name: string }) =>
            adminAPI.updateDepartment(data.id, { name: data.name }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['departments'] });
            closeFormModal();
        },
    });

    const deleteMutation = useMutation({
        mutationFn: adminAPI.deleteDepartment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['departments'] });
            closeDeleteModal();
        },
    });

    // --- Handlers ---

    const handleOpenCreate = () => {
        setSelectedDepartment(null);
        setFormData({ name: '' });
        setIsFormModalOpen(true);
    };

    const handleOpenEdit = (dept: DepartmentSummary) => {
        setSelectedDepartment(dept);
        setFormData({ name: dept.name });
        setIsFormModalOpen(true);
    };

    const handleOpenDelete = (dept: DepartmentSummary) => {
        setSelectedDepartment(dept);
        setIsDeleteModalOpen(true);
    };

    const closeFormModal = () => {
        setIsFormModalOpen(false);
        setSelectedDepartment(null);
        setFormData({ name: '' });
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setSelectedDepartment(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name.trim()) return;

        if (selectedDepartment) {
            updateMutation.mutate({ id: selectedDepartment.id, name: formData.name });
        } else {
            createMutation.mutate(formData);
        }
    };

    // --- Filter Logic ---

    const filteredDepartments = departments?.filter((dept: DepartmentSummary) =>
        dept.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Departments</h1>
                    <p className="text-sm text-gray-600 mt-1">Manage university departments and faculties.</p>
                </div>
                <Button onClick={handleOpenCreate} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add Department
                </Button>
            </div>

            {/* Search & List */}
            <Card className="!p-0 overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search departments..."
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 bg-white"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {filteredDepartments.length === 0 ? (
                    <div className="p-12 text-center">
                        <Building2 className="mx-auto h-12 w-12 text-gray-300" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No departments found</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding a new department.'}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {filteredDepartments.map((dept: DepartmentSummary) => (
                                <tr key={dept.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600">
                                                <Building2 className="h-5 w-5" />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{dept.name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => handleOpenEdit(dept)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                                title="Edit Department"
                                            >
                                                <Edit2 className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleOpenDelete(dept)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                                title="Delete Department"
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
            <Modal
                isOpen={isFormModalOpen}
                onClose={closeFormModal}
                title={selectedDepartment ? "Edit Department" : "Add Department"}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Department Name"
                        placeholder="e.g. Computer Science"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        autoFocus
                    />
                    <div className="flex justify-end gap-3 mt-6">
                        <Button type="button" variant="secondary" onClick={closeFormModal}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            isLoading={createMutation.isPending || updateMutation.isPending}
                        >
                            {selectedDepartment ? "Save Changes" : "Create Department"}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={closeDeleteModal}
                title="Confirm Deletion"
            >
                <div className="space-y-4">
                    <div className="bg-red-50 p-4 rounded-md flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                        <div>
                            <h4 className="text-sm font-medium text-red-800">Warning</h4>
                            <p className="text-sm text-red-700 mt-1">
                                Are you sure you want to delete <strong>{selectedDepartment?.name}</strong>?
                                This action cannot be undone and might affect students assigned to this department.
                            </p>
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                        <Button type="button" variant="secondary" onClick={closeDeleteModal}>
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            className="bg-red-600 hover:bg-red-700 text-white"
                            onClick={() => selectedDepartment && deleteMutation.mutate(selectedDepartment.id)}
                            isLoading={deleteMutation.isPending}
                        >
                            Delete Department
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};
