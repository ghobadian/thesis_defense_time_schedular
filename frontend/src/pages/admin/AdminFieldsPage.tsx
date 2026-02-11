import React, {useMemo, useState} from 'react';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {BookOpen, Building2, Edit2, Loader2, Plus, Save, Search, Trash2, X} from 'lucide-react';
import {adminAPI} from '../../api/admin.api';
import {DepartmentSummary, Field} from "../../types";

// Reusing the Card style
const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
    <div className={`bg-white rounded-xl border border-gray-200 shadow-sm ${className}`}>
        {children}
    </div>
);

const AdminFieldsPage = () => {
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingField, setEditingField] = useState<Field | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>('ALL');

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        departmentId: ''
    });

    // --- Data Fetching using adminAPI ---
    const { data: fields = [], isLoading: isLoadingFields } = useQuery({
        queryKey: ['fields'],
        queryFn: adminAPI.getAllFields
    });

    const { data: departments = [] } = useQuery({
        queryKey: ['departments'],
        queryFn: adminAPI.getAllDepartments
    });


    const createFieldMutation = useMutation({
        mutationFn: async (newField: { name: string; departmentId: number }) => {
            return await adminAPI.createField(newField);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['fields'] });
            closeModal();
            alert('Field created successfully');
        },
        onError: (err: any) => alert(err.response?.data?.message || 'Failed to create field')
    });

    const updateFieldMutation = useMutation({
        mutationFn: async (data: { id: number; field: { name: string; departmentId: number } }) => {
            return await adminAPI.updateField(data.id, data.field);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['fields'] });
            closeModal();
            alert('Field updated successfully');
        },
        onError: (err: any) => alert(err.response?.data?.message || 'Failed to update field')
    });

    const deleteFieldMutation = useMutation({
        mutationFn: async (id: number) => {
            return await adminAPI.deleteField(id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['fields'] });
            alert('Field deleted successfully');
        }
    });

    // --- Handlers ---
    const handleOpenModal = (field?: Field) => {
        if (field) {
            setEditingField(field);
            setFormData({
                name: field.name,
                departmentId: field.department.id.toString()
            });
        } else {
            setEditingField(null);
            setFormData({ name: '', departmentId: '' });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingField(null);
        setFormData({ name: '', departmentId: '' });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.departmentId) return;

        const payload = {
            name: formData.name,
            departmentId: parseInt(formData.departmentId)
        };

        if (editingField) {
            updateFieldMutation.mutate({ id: editingField.id, field: payload });
        } else {
            createFieldMutation.mutate(payload);
        }
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Are you sure you want to delete this field? This action cannot be undone.')) {
            deleteFieldMutation.mutate(id);
        }
    };

    // --- Filtering Logic ---
    const filteredFields = useMemo(() => {
        return fields.filter((field: Field) => {
            const matchesSearch = field.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesDept = selectedDeptFilter === 'ALL' || field.department.id.toString() === selectedDeptFilter;
            return matchesSearch && matchesDept;
        });
    }, [fields, searchTerm, selectedDeptFilter]);

    const isLoadingAction = createFieldMutation.isPending || updateFieldMutation.isPending;

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Fields Management</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage study fields and their department associations</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
                    style={{ backgroundColor: '#2563EB' }}
                >
                    <Plus className="h-4 w-4" />
                    Add New Field
                </button>
            </div>

            {/* Filters */}
            <Card className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search fields..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        />
                    </div>
                    <div className="w-full md:w-64">
                        <select
                            value={selectedDeptFilter}
                            onChange={(e) => setSelectedDeptFilter(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                        >
                            <option value="ALL">All Departments</option>
                            {departments.map((dept: DepartmentSummary) => (
                                <option key={dept.id} value={dept.id}>{dept.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </Card>

            {/* Content */}
            {isLoadingFields ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
                </div>
            ) : filteredFields.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No fields found</h3>
                    <p className="text-gray-500 mt-1">Try adjusting your filters or add a new field.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredFields.map((field: Field) => {
                        return (
                            <Card key={field.id} className="p-5 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="p-2 bg-blue-50 rounded-lg">
                                        <BookOpen className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleOpenModal(field)}
                                            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                            title="Edit"
                                        >
                                            <Edit2 className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(field.id)}
                                            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>

                                <h3 className="font-semibold text-gray-900 text-lg mb-2">{field.name}</h3>

                                <div className="flex items-center text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full w-fit">
                                    <Building2 className="h-3.5 w-3.5 mr-2" />
                                    {field.department.name}
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}

            {/* Create/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center p-4 border-b border-gray-100">
                            <h2 className="text-xl font-semibold text-gray-900">
                                {editingField ? 'Edit Field' : 'Add New Field'}
                            </h2>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Field Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g. Software Engineering"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Department
                                </label>
                                <select
                                    value={formData.departmentId}
                                    onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                                    required
                                >
                                    <option value="">Select Department</option>
                                    {departments.map((dept: DepartmentSummary) => (
                                        <option key={dept.id} value={dept.id}>
                                            {dept.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

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
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    style={{ backgroundColor: '#2563EB' }}
                                >
                                    {isLoadingAction ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Save className="h-4 w-4" />
                                    )}
                                    {editingField ? 'Save Changes' : 'Create Field'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminFieldsPage;
