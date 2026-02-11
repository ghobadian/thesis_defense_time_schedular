// src/pages/professor/ProfessorThesisForms.tsx

import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { professorAPI } from '../../api/professor.api';
import { FormState, RevisionTarget, ThesisForm } from '../../types';
import { useAuthStore } from '../../store/authStore';
import { RejectionModal } from '../../components/thesis/RejectionModal';
import { ActionButton } from '../../components/thesis/ThesisFormDetails';
import { ThesisFormsLayout } from '../../components/thesis/ThesisFormLayout';
import { JurySelectionModal } from '../../components/common/JurySelectionModal';
import { RevisionRequestModal } from '../../components/thesis/RevisionRequestModal';
import { SubmitRevisionModal } from '../../components/thesis/SubmitRevisionModal';

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

    // State for revision request modal
    const [revisionModalOpen, setRevisionModalOpen] = useState(false);
    const [formToRequestRevision, setFormToRequestRevision] = useState<ThesisForm | null>(null);

    // State for submit revision modal
    const [submitRevisionModalOpen, setSubmitRevisionModalOpen] = useState(false);
    const [formToSubmitRevision, setFormToSubmitRevision] = useState<ThesisForm | null>(null);
    const { userId } = useAuthStore();

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
        },
    });

    // Mutation for revision request
    const revisionMutation = useMutation({
        mutationFn: ({ formId, target, message }: { formId: number; target: RevisionTarget; message: string }) =>
            professorAPI.requestRevision(formId, target, message),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['professor-pending-forms'] });
            setSelectedForm(null);
            setRevisionModalOpen(false);
            setFormToRequestRevision(null);
        },
        onError: (error: any) => {
            alert(error.response?.data?.message || 'Failed to request revision');
        },
    });

    // Mutation for submitting revision (instructor submits their revision)
    const submitRevisionMutation = useMutation({
        mutationFn: (formId: number) => professorAPI.submitRevision(formId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['professor-pending-forms'] });
            setSelectedForm(null);
            setSubmitRevisionModalOpen(false);
            setFormToSubmitRevision(null);
        },
        onError: (error: any) => {
            alert(error.response?.data?.message || 'Failed to submit revision');
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

    const actionLoading =
        approveMutation.isPending ||
        rejectMutation.isPending ||
        createMeetingMutation.isPending ||
        revisionMutation.isPending ||
        submitRevisionMutation.isPending;

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

    // Handle opening revision request modal
    const handleRevisionClick = (form: ThesisForm) => {
        setFormToRequestRevision(form);
        setRevisionModalOpen(true);
    };

    // Handle revision request confirmation
    const handleRevisionConfirm = (target: RevisionTarget, message: string) => {
        if (formToRequestRevision) {
            revisionMutation.mutate({
                formId: formToRequestRevision.id,
                target,
                message,
            });
        }
    };

    // Handle revision modal close
    const handleRevisionModalClose = () => {
        if (!revisionMutation.isPending) {
            setRevisionModalOpen(false);
            setFormToRequestRevision(null);
        }
    };

    // Handle opening submit revision modal
    const handleSubmitRevisionClick = (form: ThesisForm) => {
        setFormToSubmitRevision(form);
        setSubmitRevisionModalOpen(true);
    };

    // Handle submit revision confirmation
    const handleSubmitRevisionConfirm = () => {
        if (formToSubmitRevision) {
            submitRevisionMutation.mutate(formToSubmitRevision.id);
        }
    };

    // Handle submit revision modal close
    const handleSubmitRevisionModalClose = () => {
        if (!submitRevisionMutation.isPending) {
            setSubmitRevisionModalOpen(false);
            setFormToSubmitRevision(null);
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
                location: "To be determined",
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

    // Helper to check if form is in instructor revision requested state
    const isInstructorRevisionRequested = (state: FormState): boolean => {
        return state === FormState.MANAGER_REVISION_REQUESTED_FOR_INSTRUCTOR ||
               state === FormState.ADMIN_REVISION_REQUESTED_FOR_INSTRUCTOR;
    };

    // Get the requester name for display in modal
    const getRevisionRequester = (state: FormState): string => {
        if (state === FormState.MANAGER_REVISION_REQUESTED_FOR_INSTRUCTOR) {
            return 'Manager';
        }
        if (state === FormState.ADMIN_REVISION_REQUESTED_FOR_INSTRUCTOR) {
            return 'Admin';
        }
        return 'Unknown';
    };

    // Determine available revision targets based on form state and role
    const getRevisionTargets = (form: ThesisForm): RevisionTarget[] => {
        // Instructor reviewing SUBMITTED form can only request revision from Student
        if (form.state === FormState.SUBMITTED) {
            return [RevisionTarget.STUDENT];
        }

        // Instructor with revision request can forward to student
        if (isInstructorRevisionRequested(form.state) && role === 'PROFESSOR') {
            return [RevisionTarget.STUDENT];
        }

        // Manager reviewing ADMIN_APPROVED form can request revision from Student, Instructor, or Admin
        if (form.state === FormState.ADMIN_APPROVED && role === 'MANAGER') {
            return [RevisionTarget.STUDENT, RevisionTarget.INSTRUCTOR, RevisionTarget.ADMIN];
        }

        return [];
    };

    // Determine actions based on form state and user role
    const getActionsForForm = (form: ThesisForm): ActionButton[] => {
        // Guard: Only professors and managers can take actions
        if (role !== 'PROFESSOR' && role !== 'MANAGER') return [];

        // SUBMITTED state: Instructor can approve/request revision/reject
        if (form.state === FormState.SUBMITTED && form.instructorId === userId) {
            return [
                {
                    label: 'Approve Form',
                    loadingLabel: 'Approving...',
                    className: 'btn-approve',
                    onClick: () => approveMutation.mutate(form.id),
                },
                {
                    label: 'Request Student Revision',
                    loadingLabel: 'Requesting...',
                    className: 'btn-revision',
                    onClick: () => handleRevisionClick(form),
                },
                {
                    label: 'Reject Form',
                    loadingLabel: 'Rejecting...',
                    className: 'btn-reject',
                    onClick: () => handleRejectClick(form),
                },
            ];
        }

        // Instructor revision requested states: Instructor can submit revision, forward to student, or reject
        if (isInstructorRevisionRequested(form.state) && role === 'PROFESSOR') {
            return [
                {
                    label: 'Submit Revision',
                    loadingLabel: 'Submitting...',
                    className: 'btn-approve',
                    onClick: () => handleSubmitRevisionClick(form),
                },
                {
                    label: 'Request Student Revision',
                    loadingLabel: 'Requesting...',
                    className: 'btn-revision',
                    onClick: () => handleRevisionClick(form),
                },
                {
                    label: 'Reject Form',
                    loadingLabel: 'Rejecting...',
                    className: 'btn-reject',
                    onClick: () => handleRejectClick(form),
                },
            ];
        }

        // ADMIN_APPROVED state: Only manager can approve (with jury selection), request revision, or reject
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
                        label: 'Request Revision',
                        loadingLabel: 'Requesting...',
                        className: 'btn-revision',
                        onClick: () => handleRevisionClick(form),
                    },
                    {
                        label: 'Reject Form',
                        loadingLabel: 'Rejecting...',
                        className: 'btn-reject',
                        onClick: () => handleRejectClick(form),
                    },
                ];
            }}

        return [];
    };

    // Dynamic title based on role
    const getPageTitle = () => {
        if (role === 'MANAGER') {
            return 'Thesis Forms Review - Manager';
        }
        return 'Thesis Forms - Instructor Review';
    };

    const getAvailableStatuses = (): FormState[] | undefined => {
        if (role !== 'MANAGER') {
            return [
                FormState.SUBMITTED,
                FormState.INSTRUCTOR_APPROVED,
                FormState.INSTRUCTOR_REVISION_REQUESTED,
                FormState.INSTRUCTOR_REJECTED,
                FormState.ADMIN_APPROVED,
                FormState.ADMIN_REVISION_REQUESTED_FOR_INSTRUCTOR,
                FormState.ADMIN_REJECTED,
                FormState.MANAGER_APPROVED,
                FormState.MANAGER_REVISION_REQUESTED_FOR_INSTRUCTOR,
                FormState.MANAGER_REJECTED,
            ];
        }
        return undefined; // Manager sees all statuses
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
                availableStatuses={getAvailableStatuses()}
            />

            {/* Rejection Modal */}
            <RejectionModal
                isOpen={rejectionModalOpen}
                onClose={handleRejectModalClose}
                onConfirm={handleRejectConfirm}
                thesisTitle={formToReject?.title || ''}
                isLoading={rejectMutation.isPending}
            />

            {/* Revision Request Modal */}
            <RevisionRequestModal
                isOpen={revisionModalOpen}
                onClose={handleRevisionModalClose}
                onConfirm={handleRevisionConfirm}
                thesisTitle={formToRequestRevision?.title || ''}
                availableTargets={formToRequestRevision ? getRevisionTargets(formToRequestRevision) : []}
                isLoading={revisionMutation.isPending}
            />

            {/* Submit Revision Modal */}
            <SubmitRevisionModal
                isOpen={submitRevisionModalOpen}
                onClose={handleSubmitRevisionModalClose}
                onConfirm={handleSubmitRevisionConfirm}
                thesisTitle={formToSubmitRevision?.title || ''}
                revisionMessage={formToSubmitRevision?.revisionMessage || ''}
                requestedBy={formToSubmitRevision ? getRevisionRequester(formToSubmitRevision.state) : ''}
                requestedAt={formToSubmitRevision?.revisionRequestedAt}
                isLoading={submitRevisionMutation.isPending}
            />

            {/* Jury Selection Modal */}
            {formToApproveWithJury && (
                <JurySelectionModal
                    isOpen={juryModalOpen}
                    onClose={handleJuryModalClose}
                    meetingId={0}
                    formId={formToApproveWithJury.id}
                    instructorId={formToApproveWithJury.instructorId}
                    onJuriesSelected={handleJuriesSelected}
                    minJuryCount={1}
                />
            )}
        </>
    );
};

export default ProfessorThesisFormsPage;
