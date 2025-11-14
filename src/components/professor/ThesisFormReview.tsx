import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { professorAPI } from '../../api/professor.api';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

export const ThesisFormReview: React.FC = () => {
    const queryClient = useQueryClient();
    const [selectedForm, setSelectedForm] = useState<any>(null);

    const { data: forms, isLoading } = useQuery({
        queryKey: ['pendingThesisForms'],
        queryFn: professorAPI.getPendingThesisForms,
    });

    const approveMutation = useMutation({
        mutationFn: (formId: number) => professorAPI.approveThesisForm(formId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pendingThesisForms'] });
            alert('Thesis form approved successfully!');
            setSelectedForm(null);
        },
        onError: (error: any) => {
            alert(error.response?.data?.message || 'Failed to approve form');
        },
    });

    const rejectMutation = useMutation({
        mutationFn: ({ formId, reason }: { formId: number; reason: string }) =>
            professorAPI.rejectThesisForm(formId, reason),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pendingThesisForms'] });
            alert('Thesis form rejected');
            setSelectedForm(null);
        },
    });

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Thesis Forms Review</h2>

            <div className="grid gap-4">
                {forms?.map((form: any) => (
                    <Card key={form.id}>
                        <div className="space-y-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">{form.title}</h3>
                                    <p className="text-sm text-gray-600">
                                        Student: {form.student.firstName} {form.student.lastName}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Submitted: {new Date(form.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                    {form.state.replace(/_/g, ' ')}
                                </span>
                            </div>

                            <div>
                                <h4 className="font-medium text-gray-700 mb-2">Abstract:</h4>
                                <p className="text-gray-600 text-sm">{form.abstractText}</p>
                            </div>

                            {form.suggestedJury?.length > 0 && (
                                <div>
                                    <h4 className="font-medium text-gray-700 mb-2">Suggested Jury:</h4>
                                    <ul className="list-disc list-inside text-sm text-gray-600">
                                        {form.suggestedJury.map((prof: any) => (
                                            <li key={prof.id}>
                                                {prof.firstName} {prof.lastName}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div className="flex space-x-3">
                                <Button
                                    onClick={() => approveMutation.mutate(form.id)}
                                    isLoading={approveMutation.isPending}
                                    className="flex items-center space-x-2"
                                >
                                    <CheckCircle className="h-4 w-4" />
                                    <span>Approve</span>
                                </Button>
                                <Button
                                    variant="secondary"
                                    onClick={() => setSelectedForm(form)}
                                    className="flex items-center space-x-2"
                                >
                                    <XCircle className="h-4 w-4" />
                                    <span>Reject</span>
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {selectedForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <Card className="max-w-md w-full">
                        <h3 className="text-lg font-semibold mb-4">Reject Thesis Form</h3>
                        <textarea
                            className="w-full border rounded-lg p-3 mb-4"
                            rows={4}
                            placeholder="Reason for rejection..."
                            id="rejection-reason"
                        />
                        <div className="flex space-x-3">
                            <Button
                                onClick={() => {
                                    const reason = (document.getElementById('rejection-reason') as HTMLTextAreaElement).value;
                                    rejectMutation.mutate({ formId: selectedForm.id, reason });
                                }}
                                isLoading={rejectMutation.isPending}
                            >
                                Confirm Rejection
                            </Button>
                            <Button variant="secondary" onClick={() => setSelectedForm(null)}>
                                Cancel
                            </Button>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};
