// src/pages/professor/ThesisFormReview.tsx

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { professorAPI } from '../../api/professor.api';
import { useAuthStore } from '../../store/authStore';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { JurySelectionModal } from '../common/JurySelectionModal';
import { ThesisForm } from "../../types";

export const ThesisFormReview: React.FC = () => {
    const { role } = useAuthStore();
    const queryClient = useQueryClient();
    const [selectedFormId, setSelectedFormId] = useState<number | null>(null);
    const [selectedMeetingId, setSelectedMeetingId] = useState<number | null>(null);
    const [showJuryModal, setShowJuryModal] = useState(false);

    // Fetch forms pending manager review (status: ADMIN_APPROVED)
    const { data: forms = [], isLoading } = useQuery({
        queryKey: ['thesis-forms-review'],
        queryFn: () => professorAPI.getPendingThesisForms(),
        enabled: role === 'MANAGER',
    });

    // Schedule Meeting / Assign Juries mutation
    // Fixed: Changed from suggestJuries (non-existent) to scheduleMeeting
    const scheduleMeetingMutation = useMutation({
        mutationFn: ({ formId, juryIds, location }: { formId: number; juryIds: number[]; location: string }) =>
            professorAPI.createMeeting(formId, juryIds, location),
    });

    // Handle jury selection
    const handleJuriesSelected = async (juryIds: number[]) => {
        if (!selectedFormId) {
            throw new Error('Form ID not found');
        }

        await scheduleMeetingMutation.mutateAsync({
            formId: selectedFormId,
            juryIds,
            location: "To be determined"
        });

        queryClient.invalidateQueries({ queryKey: ['thesis-forms-review'] });
        setShowJuryModal(false);
    };

    const handleOpenJuryModal = (formId: number, meetingId: number) => {
        setSelectedFormId(formId);
        setSelectedMeetingId(meetingId);
        setShowJuryModal(true);
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Thesis Forms Review</h1>

            <div className="space-y-4">
                {forms.map((form: ThesisForm) => (
                    <Card key={form.id} className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-lg font-medium">{form.title}</h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    Student: {form.studentFirstName} {form.studentLastName}
                                </p>
                            </div>
                            <div className="flex space-x-2">
                                <Button
                                    variant="secondary"
                                    onClick={() => handleOpenJuryModal(form.id, 0)}
                                >
                                    Assign Juries
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}
                {forms.length === 0 && <p className="text-gray-500">No forms pending review.</p>}
            </div>

            {selectedFormId && (
                <JurySelectionModal
                    isOpen={showJuryModal}
                    onClose={() => setShowJuryModal(false)}
                    meetingId={selectedMeetingId || 0}
                    formId={selectedFormId}
                    onJuriesSelected={handleJuriesSelected}
                    minJuryCount={1}
                />
            )}
        </div>
    );
};
