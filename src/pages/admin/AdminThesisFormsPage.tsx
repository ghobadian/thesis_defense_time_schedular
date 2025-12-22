// src/pages/admin/AdminThesisFormsPage.tsx

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminAPI } from '../../api/admin.api';
import { ThesisForm, FormState } from '../../types';
import { useAuthStore } from '../../store/authStore';
import { RejectionModal } from '../../components/thesis/RejectionModal';
import { ActionButton, ThesisFormDetails } from '../../components/thesis/ThesisFormDetails';
import { ThesisFormsLayout } from '../../components/thesis/ThesisFormLayout';
import './AdminThesisFormsPage.css';

const AdminThesisFormsPage: React.FC = () => {
    const { role } = useAuthStore();
    const queryClient = useQueryClient();
    const [selectedForm, setSelectedForm] = useState<ThesisForm | null>(null);

    // State for rejection modal
    const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
    const [formToReject, setFormToReject] = useState<ThesisForm | null>(null);

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

    const actionLoading = approveMutation.isPending || rejectMutation.isPending;

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

    const getActionsForForm = (form: ThesisForm): ActionButton[] => {
        // 🔒 HARD GUARD — safety against improper reuse
        if (role !== 'ADMIN') return [];

        if (form.state !== FormState.INSTRUCTOR_APPROVED) return [];

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
            />

            {/* Rejection Modal */}
            <RejectionModal
                isOpen={rejectionModalOpen}
                onClose={handleModalClose}
                onConfirm={handleRejectConfirm}
                thesisTitle={formToReject?.title || ''}
                isLoading={rejectMutation.isPending}
            />
        </>
    );
};

export default AdminThesisFormsPage;
