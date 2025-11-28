// src/pages/professor/MyThesisForms.tsx

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { professorAPI } from '../../api/professor.api';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { JurySelectionModal } from '../../components/common/JurySelectionModal';
import { Clock, Eye, CheckCircle, XCircle, X } from 'lucide-react';
import { FormState, ThesisForm } from '../../types';

// Rejection Modal Component
interface RejectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (reason: string) => void;
    isLoading: boolean;
    formTitle: string;
}



const RejectionModal: React.FC<RejectionModalProps> = ({
                                                           isOpen,
                                                           onClose,
                                                           onConfirm,
                                                           isLoading,
                                                           formTitle
                                                       }) => {
    const [reason, setReason] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (reason.trim()) {
            onConfirm(reason.trim());
            setReason('');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">Reject Thesis Form</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                        disabled={isLoading}
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <p className="text-sm text-gray-600 mb-4">
                    You are about to reject: <strong>{formTitle}</strong>
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label
                            htmlFor="rejection-reason"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Rejection Reason <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="rejection-reason"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows={4}
                            placeholder="Please provide a reason for rejection..."
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div className="flex justify-end space-x-3">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={!reason.trim() || isLoading}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {isLoading ? 'Rejecting...' : 'Reject Form'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export const MyThesisForms: React.FC = () => {
    const queryClient = useQueryClient();
    const [selectedFormId, setSelectedFormId] = useState<number | null>(null);
    const [showJuryModal, setShowJuryModal] = useState(false);
    const [showRejectionModal, setShowRejectionModal] = useState(false);
    const [selectedFormForRejection, setSelectedFormForRejection] = useState<ThesisForm | null>(null);

    // Fetch thesis forms
    const { data: forms = [], isLoading } = useQuery({
        queryKey: ['my-thesis-forms'],
        queryFn: professorAPI.getPendingThesisForms,
    });

    // Approve thesis form mutation
    const approveMutation = useMutation({
        mutationFn: (formId: number) => professorAPI.approveThesisForm(formId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-thesis-forms'] });
            alert('Thesis form approved successfully!');
        },
        onError: (error: any) => {
            alert('Failed to approve form: ' + (error.response?.data?.message || error.message));
        }
    });

    // Reject thesis form mutation
    const rejectMutation = useMutation({
        mutationFn: ({ formId, reason }: { formId: number; reason: string }) =>
            professorAPI.rejectThesisForm(formId, reason),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-thesis-forms'] });
            setShowRejectionModal(false);
            setSelectedFormForRejection(null);
            alert('Thesis form rejected.');
        },
        onError: (error: any) => {
            alert('Failed to reject form: ' + (error.response?.data?.message || error.message));
        }
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

    const handleApprove = async (formId: number) => {
        if (window.confirm('Are you sure you want to approve this thesis form?')) {
            await approveMutation.mutateAsync(formId);
        }
    };

    const handleOpenRejectionModal = (form: ThesisForm) => {
        setSelectedFormForRejection(form);
        setShowRejectionModal(true);
    };

    const handleRejectConfirm = async (reason: string) => {
        if (selectedFormForRejection) {
            await rejectMutation.mutateAsync({
                formId: selectedFormForRejection.id,
                reason
            });
        }
    };

    const handleJuriesSelected = async (juryIds: number[]) => {
        if (!selectedFormId) return;

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
            case FormState.SUBMITTED:
                return 'bg-yellow-100 text-yellow-800';
            case FormState.INSTRUCTOR_APPROVED:
                return 'bg-blue-100 text-blue-800';
            case FormState.ADMIN_APPROVED:
                return 'bg-purple-100 text-purple-800';
            case FormState.MANAGER_APPROVED:
                return 'bg-green-100 text-green-800';
            case FormState.ADMIN_REJECTED:
            case FormState.MANAGER_REJECTED:
            case FormState.INSTRUCTOR_REJECTED:
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusLabel = (state: FormState) => {
        switch (state) {
            case FormState.SUBMITTED:
                return 'Pending Review';
            case FormState.INSTRUCTOR_APPROVED:
                return 'Instructor Approved';
            case FormState.INSTRUCTOR_REJECTED:
                return 'Instructor Rejected';
            case FormState.ADMIN_APPROVED:
                return 'Admin Approved';
            case FormState.ADMIN_REJECTED:
                return 'Admin Rejected';
            case FormState.MANAGER_APPROVED:
                return 'Manager Approved';
            case FormState.MANAGER_REJECTED:
                return 'Manager Rejected';
            default:
                return state;
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-64">
                <div className="text-gray-500">Loading thesis forms...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">My Thesis Forms</h1>
                <div className="text-sm text-gray-500">
                    Total: {forms.length} form(s)
                </div>
            </div>

            {forms.length === 0 ? (
                <Card className="p-8 text-center">
                    <p className="text-gray-500">No thesis forms found.</p>
                </Card>
            ) : (
                <div className="space-y-4">
                    {forms.map((form: ThesisForm) => (
                        <Card key={form.id} className="p-6">
                            <div className="flex justify-between items-start">
                                <div className="space-y-2 flex-1">
                                    <div className="flex items-center space-x-3">
                                        <h3 className="text-xl font-semibold text-gray-900">
                                            {form.title}
                                        </h3>
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(form.state)}`}
                                        >
                                            {getStatusLabel(form.state)}
                                        </span>
                                    </div>

                                    <p className="text-sm text-gray-600 line-clamp-2">
                                        {form.abstractText}
                                    </p>

                                    {/* Field Name Display */}
                                    {form.field && (
                                        <p className="text-xs text-gray-500">
                                            <span className="font-semibold">Field:</span> {form.field.name}
                                        </p>
                                    )}

                                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                                        <span className="flex items-center">
                                            <Clock className="h-4 w-4 mr-1" />
                                            {new Date(form.createdAt).toLocaleDateString()}
                                        </span>
                                        <span>
                                            <span className="font-medium">Student:</span>{' '}
                                            {form.studentFirstName} {form.studentLastName}
                                        </span>
                                        {form.studentNumber && (
                                            <span className="text-gray-400">
                                                #{form.studentNumber}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-col space-y-2 ml-4">
                                    {/* View Button - Always visible */}
                                    <Button variant="secondary" size="sm">
                                        <Eye className="h-4 w-4 mr-2" />
                                        View
                                    </Button>

                                    {/* Approve/Reject buttons for SUBMITTED forms */}
                                    {form.state === FormState.SUBMITTED && (
                                        <>
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                onClick={() => handleApprove(form.id)}
                                                disabled={approveMutation.isPending}
                                                className="bg-green-600 hover:bg-green-700"
                                            >
                                                <CheckCircle className="h-4 w-4 mr-2" />
                                                {approveMutation.isPending ? 'Approving...' : 'Approve'}
                                            </Button>
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                onClick={() => handleOpenRejectionModal(form)}
                                                disabled={rejectMutation.isPending}
                                                className="text-red-600 border-red-300 hover:bg-red-50"
                                            >
                                                <XCircle className="h-4 w-4 mr-2" />
                                                Reject
                                            </Button>
                                        </>
                                    )}

                                    {/* Assign Juries button for ADMIN_APPROVED forms */}
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
            )}

            {/* Jury Selection Modal */}
            {selectedFormId && (
                <JurySelectionModal
                    isOpen={showJuryModal}
                    onClose={() => setShowJuryModal(false)}
                    meetingId={0}
                    formId={selectedFormId}
                    onJuriesSelected={handleJuriesSelected}
                />
            )}

            {/* Rejection Modal */}
            <RejectionModal
                isOpen={showRejectionModal}
                onClose={() => {
                    setShowRejectionModal(false);
                    setSelectedFormForRejection(null);
                }}
                onConfirm={handleRejectConfirm}
                isLoading={rejectMutation.isPending}
                formTitle={selectedFormForRejection?.title || ''}
            />
        </div>
    );
};
