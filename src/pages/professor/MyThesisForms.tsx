// src/pages/professor/MyThesisForms.tsx

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { professorAPI } from '../../api/professor.api';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { JurySelectionModal } from '../../components/common/JurySelectionModal';
import { Clock, Eye } from 'lucide-react';
import {FormState, ThesisForm} from '../../types';

export const MyThesisForms: React.FC = () => {
    const queryClient = useQueryClient();
    const [selectedFormId, setSelectedFormId] = useState<number | null>(null);
    const [showJuryModal, setShowJuryModal] = useState(false);

    // Fetch thesis forms
    const { data: forms = [], isLoading } = useQuery({
        queryKey: ['my-thesis-forms'],
        queryFn: professorAPI.getPendingThesisForms,
    });

    // Schedule meeting (Used for Jury Selection)
    const scheduleMeetingMutation = useMutation({
        mutationFn: ({ formId, juryIds, location }: { formId: number; juryIds: number[]; location: string }) =>
            professorAPI.createMeeting(formId, juryIds, location),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-thesis-forms'] });
            setShowJuryModal(false);
        },
        onError: (error: any) => {
            alert('Failed to submit juries: ' + (error.response?.data?.message || error.message));
        }
    });

    const handleJuriesSelected = async (juryIds: number[]) => {
        if (!selectedFormId) return;

        // Default location "TBD" as the modal currently only selects Juries
        await scheduleMeetingMutation.mutateAsync({
            formId: selectedFormId,
            juryIds,
            location: "To be determined"
        });
    };

    const handleOpenJuryModal = (formId: number) => {
        setSelectedFormId(formId);
        setShowJuryModal(true);
    };

    const getStatusColor = (state: FormState) => {
        switch (state) {
            case FormState.SUBMITTED: return 'bg-yellow-100 text-yellow-800';
            case FormState.ADMIN_APPROVED: return 'bg-purple-100 text-purple-800';
            case FormState.MANAGER_APPROVED: return 'bg-green-100 text-green-800';
            case FormState.ADMIN_REJECTED:
            case FormState.MANAGER_REJECTED:
            case FormState.INSTRUCTOR_REJECTED: return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">My Thesis Forms</h1>

            <div className="space-y-4">
                {forms.map((form: ThesisForm) => (
                    <Card key={form.id} className="p-6">
                        <div className="flex justify-between items-start">
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <h3 className="text-xl font-semibold text-gray-900">{form.title}</h3>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(form.state)}`}>
                                        {form.state}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 line-clamp-2">{form.abstractText}</p>

                                {/* Field Name Display */}
                                {form.field && (
                                    <p className="text-xs text-gray-500 font-semibold">Field: {form.field.name}</p>
                                )}

                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                    <span className="flex items-center">
                                        <Clock className="h-4 w-4 mr-1" />
                                        {new Date(form.createdAt).toLocaleDateString()}
                                    </span>
                                    <span>Student: {form.studentFirstName} {form.studentLastName}</span>
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                <Button variant="secondary" size="sm">
                                    <Eye className="h-4 w-4 mr-2" />
                                    View
                                </Button>
                                {/* Only show Assign Juries if Admin Approved (waiting for Manager/Professor action) */}
                                {form.state === FormState.ADMIN_APPROVED && (
                                    <Button
                                        onClick={() => handleOpenJuryModal(form.id)}
                                        size="sm"
                                    >
                                        Select Juries
                                    </Button>
                                )}
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {selectedFormId && (
                <JurySelectionModal
                    isOpen={showJuryModal}
                    onClose={() => setShowJuryModal(false)}
                    meetingId={0} // We are creating a meeting, so ID is 0 or null effectively
                    formId={selectedFormId}
                    onJuriesSelected={handleJuriesSelected}
                />
            )}
        </div>
    );
};
