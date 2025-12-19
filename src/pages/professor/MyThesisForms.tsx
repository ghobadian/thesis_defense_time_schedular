// src/pages/professor/MyThesisForms.tsx

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { professorAPI } from '../../api/professor.api';
import { ThesisForm, FormState } from '../../types';
import { JurySelectionModal } from '../../components/common/JurySelectionModal';
import { useAuthStore } from '../../store/authStore';
import '../admin/AdminThesisFormsPage.css';
import { ActionButton } from "../../components/thesis/ThesisFormDetails";
import { RejectionModal } from "../../components/thesis/RejectionModal";
import { ThesisFormsLayout } from "../../components/thesis/ThesisFormLayout";

export const MyThesisForms: React.FC = () => {
    const { role } = useAuthStore(); // PROFESSOR | MANAGER
    const queryClient = useQueryClient();

    const [selectedForm, setSelectedForm] = useState<ThesisForm | null>(null);
    const [showRejectionModal, setShowRejectionModal] = useState(false);
    const [showJuryModal, setShowJuryModal] = useState(false);
    const [formToReject, setFormToReject] = useState<ThesisForm | null>(null);

    const { data: forms = [], isLoading, error } = useQuery({
        queryKey: ['my-thesis-forms'],
        queryFn: professorAPI.getPendingThesisForms,
    });

    const approveMutation = useMutation({
        mutationFn: (formId: number) => professorAPI.approveThesisForm(formId),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-thesis-forms'] }),
    });

    const rejectMutation = useMutation({
        mutationFn: ({ formId, reason }: { formId: number; reason: string }) =>
            professorAPI.rejectThesisForm(formId, reason),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-thesis-forms'] });
            setShowRejectionModal(false);
            setFormToReject(null);
            setSelectedForm(null);
        },
    });

    const juryMutation = useMutation({
        mutationFn: ({ formId, juryIds }: { formId: number; juryIds: number[] }) =>
            professorAPI.createMeeting(formId, juryIds, 'To be determined'),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-thesis-forms'] });
            setShowJuryModal(false);
            setSelectedForm(null);
        },
    });

    const actionLoading =
        approveMutation.isPending ||
        rejectMutation.isPending ||
        juryMutation.isPending;

    // Handler for jury selection - matches the expected signature
    const handleJuriesSelected = async (juryIds: number[]): Promise<void> => {
        if (!selectedForm) return;

        await juryMutation.mutateAsync({
            formId: selectedForm.id,
            juryIds,
        });
    };

    const getActionsForForm = (form: ThesisForm): ActionButton[] => {
        const actions: ActionButton[] = [];

        // ✅ Professor + Manager — SUBMITTED
        if (form.state === FormState.SUBMITTED) {
            actions.push(
                {
                    label: 'Approve Form',
                    loadingLabel: 'Approving...',
                    className: 'btn-approve',
                    onClick: () => approveMutation.mutate(form.id),
                },
                {
                    label: 'Reject Form',
                    loadingLabel: 'Rejecting...',
                    className: 'btn-reject',
                    onClick: () => {
                        setFormToReject(form);
                        setShowRejectionModal(true);
                    },
                }
            );
        }

        // ✅ Manager-only — ADMIN_APPROVED
        if (role === 'MANAGER' && form.state === FormState.ADMIN_APPROVED) {
            actions.push(
                {
                    label: 'Select Juries',
                    loadingLabel: 'Submitting...',
                    className: 'btn-primary',
                    onClick: () => setShowJuryModal(true),
                },
                {
                    label: 'Reject Form',
                    loadingLabel: 'Rejecting...',
                    className: 'btn-reject',
                    onClick: () => {
                        setFormToReject(form);
                        setShowRejectionModal(true);
                    },
                }
            );
        }

        return actions;
    };

    return (
        <>
            <ThesisFormsLayout
                title="My Thesis Forms"
                forms={forms}
                isLoading={isLoading}
                error={error as Error}
                selectedForm={selectedForm}
                onSelectForm={setSelectedForm}
                emptyMessage="No thesis forms pending review"
                getActionsForForm={getActionsForForm}
                actionLoading={actionLoading}
            />

            <RejectionModal
                isOpen={showRejectionModal}
                onClose={() => setShowRejectionModal(false)}
                isLoading={rejectMutation.isPending}
                formTitle={formToReject?.title || ''}
                onConfirm={(reason) =>
                    formToReject &&
                    rejectMutation.mutate({ formId: formToReject.id, reason })
                }
            />

            {showJuryModal && selectedForm && (
                <JurySelectionModal
                    isOpen={showJuryModal}
                    onClose={() => setShowJuryModal(false)}
                    meetingId={0}
                    formId={selectedForm.id}
                    onJuriesSelected={handleJuriesSelected}
                    minJuryCount={1}
                    instructorId={selectedForm.instructorId} // NEW: Pass instructor ID
                />
            )}
        </>
    );
};

export default MyThesisForms;
