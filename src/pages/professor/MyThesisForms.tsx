// src/pages/professor/MyThesisForms.tsx

import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { professorAPI } from '../../api/professor.api';
import { FormState, ThesisForm } from '../../types';
import { useAuthStore } from '../../store/authStore';
import { RejectionModal } from '../../components/thesis/RejectionModal';
import { ActionButton } from '../../components/thesis/ThesisFormDetails';
import { ThesisFormsLayout } from '../../components/thesis/ThesisFormLayout';
import { JurySelectionModal } from '../../components/common/JurySelectionModal';

const ProfessorThesisFormsPage: React.FC = () => {
    const { role } = useAuthStore();
    const queryClient = useQueryClient();
    const [selectedForm, setSelectedForm] = useState<ThesisForm | null>(null);

    // State for rejection modal
    const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
    const [formToReject, setFormToReject] = useState<ThesisForm | null>(null);

    // State for jury selection modal (manager approval of ADMIN_APPROVED forms)
    const [juryModalOpen, setJuryModalOpen] = useState(false);
    const [formToApproveWithJury, setFormToApproveWithJury] = useState<ThesisForm | null>(null);

    // Fetch pending forms for professor/manager
    const { data: forms = [], isLoading, error } = useQuery({
        queryKey: ['professor-pending-forms'],
        queryFn: professorAPI.getPendingThesisForms,
        enabled: role === 'PROFESSOR' || role === 'MANAGER',
    });

    // Mutation for instructor approval (SUBMITTED → INSTRUCTOR_APPROVED)
    const approveMutation = useMutation({
        mutationFn: (formId: number) => professorAPI.approveThesisForm(formId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['professor-pending-forms'] });
            setSelectedForm(null);
        },
        onError: (error: any) => {
            alert(error.response?.data?.message || 'Failed to approve form');
        },
    });

    // Mutation for rejection (works for both SUBMITTED and ADMIN_APPROVED states)
    const rejectMutation = useMutation({
        mutationFn: ({ formId, rejectionReason }: { formId: number; rejectionReason: string }) =>
            professorAPI.rejectThesisForm(formId, rejectionReason),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['professor-pending-forms'] });
            setSelectedForm(null);
            setRejectionModalOpen(false);
            setFormToReject(null);
        },
        onError: (error: any) => {
            alert(error.response?.data?.message || 'Failed to reject form');
            // Keep modal open on error so user can retry
        },
    });

    // Mutation for manager creating meeting with juries (ADMIN_APPROVED → JURIES_SELECTED)
    const createMeetingMutation = useMutation({
        mutationFn: ({ formId, juryIds, location }: { formId: number; juryIds: number[]; location: string }) =>
            professorAPI.createMeeting(formId, juryIds, location),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['professor-pending-forms'] });
            setJuryModalOpen(false);
            setFormToApproveWithJury(null);
            setSelectedForm(null);
        },
        onError: (error: any) => {
            alert(error.response?.data?.message || 'Failed to create meeting');
        },
    });

    const actionLoading = approveMutation.isPending || rejectMutation.isPending || createMeetingMutation.isPending;

    // Handle opening rejection modal
    const handleRejectClick = (form: ThesisForm) => {
        setFormToReject(form);
        setRejectionModalOpen(true);
    };

    // Handle rejection confirmation
    const handleRejectConfirm = (reason: string) => {
        if (formToReject) {
            rejectMutation.mutate({
                formId: formToReject.id,
                rejectionReason: reason,
            });
        }
    };

    // Handle rejection modal close
    const handleRejectModalClose = () => {
        if (!rejectMutation.isPending) {
            setRejectionModalOpen(false);
            setFormToReject(null);
        }
    };

    // Handle manager approval with jury selection (for ADMIN_APPROVED forms)
    const handleManagerApproveClick = (form: ThesisForm) => {
        setFormToApproveWithJury(form);
        setJuryModalOpen(true);
    };

    // Handle jury selection and meeting creation
    const handleJuriesSelected = async (juryIds: number[]) => {
        if (formToApproveWithJury) {
            await createMeetingMutation.mutateAsync({
                formId: formToApproveWithJury.id,
                juryIds,
                location: "To be determined", // Location will be set later or can be added to modal
            });
        }
    };

    // Handle jury modal close
    const handleJuryModalClose = () => {
        if (!createMeetingMutation.isPending) {
            setJuryModalOpen(false);
            setFormToApproveWithJury(null);
        }
    };

    // Determine actions based on form state and user role
    const getActionsForForm = (form: ThesisForm): ActionButton[] => {
        // Guard: Only professors and managers can take actions
        if (role !== 'PROFESSOR' && role !== 'MANAGER') return [];

        // SUBMITTED state: Instructor (professor or manager who is instructor) can approve/reject
        if (form.state === FormState.SUBMITTED) {
            // Both professors and managers can approve/reject SUBMITTED forms
            // (Backend should validate if the user is actually the instructor)
            return [
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
                    onClick: () => handleRejectClick(form),
                },
            ];
        }

        // ADMIN_APPROVED state: Only manager can approve (with jury selection) or reject
        if (form.state === FormState.ADMIN_APPROVED) {
            if (role === 'MANAGER') {
                return [
                    {
                        label: 'Approve & Assign Juries',
                        loadingLabel: 'Processing...',
                        className: 'btn-approve',
                        onClick: () => handleManagerApproveClick(form),
                    },
                    {
                        label: 'Reject Form',
                        loadingLabel: 'Rejecting...',
                        className: 'btn-reject',
                        onClick: () => handleRejectClick(form),
                    },
                ];
            }
        }

        return [];
    };

    // Dynamic title based on role
    const getPageTitle = () => {
        if (role === 'MANAGER') {
            return 'Thesis Forms Review - Manager';
        }
        return 'Thesis Forms - Instructor Review';
    };

    return (
        <>
            <ThesisFormsLayout
                title={getPageTitle()}
                forms={forms}
                isLoading={isLoading}
                error={error as Error}
                selectedForm={selectedForm}
                onSelectForm={setSelectedForm}
                emptyMessage="No thesis forms pending your review"
                getActionsForForm={getActionsForForm}
                actionLoading={actionLoading}
            />

            {/* Rejection Modal - Used for both SUBMITTED and ADMIN_APPROVED rejections */}
            <RejectionModal
                isOpen={rejectionModalOpen}
                onClose={handleRejectModalClose}
                onConfirm={handleRejectConfirm}
                thesisTitle={formToReject?.title || ''}
                isLoading={rejectMutation.isPending}
            />

            {/* Jury Selection Modal - Used for Manager Approval of ADMIN_APPROVED forms */}
            {formToApproveWithJury && (
                <JurySelectionModal
                    isOpen={juryModalOpen}
                    onClose={handleJuryModalClose}
                    meetingId={0}
                    formId={formToApproveWithJury.id}
                    onJuriesSelected={handleJuriesSelected}
                    minJuryCount={1}
                />
            )}
        </>
    );
};

export default ProfessorThesisFormsPage;
