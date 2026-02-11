// src/pages/admin/AdminThesisFormsPage.tsx

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminAPI } from '../../api/admin.api';
import {ThesisForm, FormState, RevisionTarget} from '../../types';
import { useAuthStore } from '../../store/authStore';
import { RejectionModal } from '../../components/thesis/RejectionModal';
import { ActionButton } from '../../components/thesis/ThesisFormDetails';
import { ThesisFormsLayout } from '../../components/thesis/ThesisFormLayout';
import './AdminThesisFormsPage.css';//TODO remove css files
import {RevisionRequestModal} from "../../components/thesis/RevisionRequestModal";
import {SubmitRevisionModal} from "../../components/thesis/SubmitRevisionModal";

const AdminThesisFormsPage: React.FC = () => {
    const { role } = useAuthStore();
    const queryClient = useQueryClient();
    const [selectedForm, setSelectedForm] = useState<ThesisForm | null>(null);

    // State for rejection modal
    const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
    const [formToReject, setFormToReject] = useState<ThesisForm | null>(null);

    // State for revision request modal
    const [revisionModalOpen, setRevisionModalOpen] = useState(false);
    const [formToRequestRevision, setFormToRequestRevision] = useState<ThesisForm | null>(null);

// State for submit revision modal
    const [submitRevisionModalOpen, setSubmitRevisionModalOpen] = useState(false);
    const [formToSubmitRevision, setFormToSubmitRevision] = useState<ThesisForm | null>(null);

    const { data: forms = [], isLoading, error } = useQuery({
        queryKey: ['admin-forms'],
        queryFn: adminAPI.getForms,
        enabled: role === 'ADMIN',
    });

    const approveMutation = useMutation({
        mutationFn: (formId: number) => adminAPI.approveForm(formId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-forms'] });
            setSelectedForm(null);
        },
    });

    const rejectMutation = useMutation({
        mutationFn: ({ formId, rejectionReason }: { formId: number; rejectionReason: string }) =>
            adminAPI.rejectForm(formId, rejectionReason),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-forms'] });
            setSelectedForm(null);
            setRejectionModalOpen(false);
            setFormToReject(null);
        },
        onError: () => {
            // Keep modal open on error so user can retry
        },
    });

    const revisionMutation = useMutation({
        mutationFn: ({ formId, target, message }: { formId: number; target: RevisionTarget; message: string }) =>
            adminAPI.requestRevision(formId, target, message),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-forms'] });
            setSelectedForm(null);
            setRevisionModalOpen(false);
            setFormToRequestRevision(null);
        },
        onError: (error: any) => {
            alert(error.response?.data?.message || 'Failed to request revision');
        },
    });

    const submitRevisionMutation = useMutation({
        mutationFn: (formId: number) => adminAPI.submitRevision(formId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-forms'] });
            setSelectedForm(null);
            setSubmitRevisionModalOpen(false);
            setFormToSubmitRevision(null);
        },
        onError: (error: any) => {
            alert(error.response?.data?.message || 'Failed to submit revision');
        },
    });

    const actionLoading = approveMutation.isPending || rejectMutation.isPending || revisionMutation.isPending || submitRevisionMutation.isPending;

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

    // Handle modal close
    const handleModalClose = () => {
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

// Get revision targets for admin
    const getRevisionTargets = (form: ThesisForm): RevisionTarget[] => {
        if (form.state === FormState.INSTRUCTOR_APPROVED || form.state === FormState.MANAGER_REVISION_REQUESTED_FOR_ADMIN) {
            return [RevisionTarget.STUDENT, RevisionTarget.INSTRUCTOR];
        }
        return [];
    };


    const getActionsForForm = (form: ThesisForm): ActionButton[] => {
        if (role !== 'ADMIN') return [];

        // INSTRUCTOR_APPROVED: Admin can approve, request revision, or reject
        if (form.state === FormState.INSTRUCTOR_APPROVED) {
            return [
                {
                    label: 'Approve Form',
                    loadingLabel: 'Approving...',
                    className: 'btn-approve',
                    onClick: () => approveMutation.mutate(form.id),
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
        }

        // MANAGER_REVISION_REQUESTED_FOR_ADMIN: Admin needs to submit their revision
        if (form.state === FormState.MANAGER_REVISION_REQUESTED_FOR_ADMIN) {
            return [
                {
                    label: 'Submit Revision',
                    loadingLabel: 'Submitting...',
                    className: 'btn-approve',
                    onClick: () => handleSubmitRevisionClick(form),
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
        }

        return [];
    };




    const getAvailableStatuses = () => {
        return [
            FormState.INSTRUCTOR_APPROVED,
            FormState.INSTRUCTOR_REJECTED,
            FormState.ADMIN_APPROVED,
            FormState.ADMIN_REJECTED,
            FormState.ADMIN_REVISION_REQUESTED_FOR_STUDENT,
            FormState.ADMIN_REVISION_REQUESTED_FOR_INSTRUCTOR,
            FormState.MANAGER_APPROVED,
            FormState.MANAGER_REVISION_REQUESTED_FOR_ADMIN,
            FormState.MANAGER_REJECTED];
    };


    return (
        <>
            <ThesisFormsLayout
                title="Thesis Forms - Admin Review"
                forms={forms}
                isLoading={isLoading}
                error={error as Error}
                selectedForm={selectedForm}
                onSelectForm={setSelectedForm}
                emptyMessage="No thesis forms pending admin review"
                getActionsForForm={getActionsForForm}
                actionLoading={actionLoading}
                availableStatuses={getAvailableStatuses()}
            />

            <RejectionModal
                isOpen={rejectionModalOpen}
                onClose={handleModalClose}
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
                requestedBy="Manager"
                requestedAt={formToSubmitRevision?.revisionRequestedAt}
                isLoading={submitRevisionMutation.isPending}
            />

        </>
    );
};

export default AdminThesisFormsPage;
