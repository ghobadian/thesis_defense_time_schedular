import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { studentAPI } from '../../api/student.api';
import { adminAPI } from '../../api/admin.api';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Card } from '../common/Card';
import {Professor, ThesisFormInput} from '../../types';
import React, {useState} from "react";

export const ThesisFormCreate: React.FC = () => {
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState<Partial<ThesisFormInput>>({
        title: '',
        abstractText: '',
        instructorId: undefined,
    });

    const { data: fields } = useQuery({
        queryKey: ['fields'],
        queryFn: adminAPI.getAllFields,
    });

    const { data: professors } = useQuery({
        queryKey: ['professors'],
        queryFn: studentAPI.getAllProfessors,
    });

    const createMutation = useMutation({
        mutationFn: studentAPI.createThesisForm,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['myThesisForms'] });
            alert('Thesis form created successfully!');
            // Reset form
            setFormData({
                title: '',
                abstractText: '',
                instructorId: undefined,
            });
        },
        onError: (error: any) => {
            alert(error.response?.data?.message || 'Failed to create thesis form');
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createMutation.mutate(formData as ThesisFormInput);
    };

    return (
        <Card title="Create Thesis Form">
            <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                    label="Thesis Title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter your thesis title"
                    required
                />

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Abstract
                    </label>
                    <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        rows={6}
                        value={formData.abstractText}
                        onChange={(e) => setFormData({ ...formData, abstractText: e.target.value })}
                        placeholder="Enter your thesis abstract"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Thesis Instructor
                    </label>
                    <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        value={formData.instructorId || ''}
                        onChange={(e) => setFormData({ ...formData, instructorId: Number(e.target.value) })}
                        required
                    >
                        <option value="">Select an instructor</option>
                        {professors?.map((professor: Professor) => (
                            <option key={professor.id} value={professor.id}>
                                {professor.firstName} {professor.lastName}
                            </option>
                        ))}
                    </select>
                </div>

                <Button
                    type="submit"
                    isLoading={createMutation.isPending}
                    disabled={
                        !formData.title ||
                        !formData.abstractText ||
                        !formData.instructorId
                    }
                    className="w-full"
                >
                    Submit Thesis Form
                </Button>
            </form>
        </Card>
    );
};
