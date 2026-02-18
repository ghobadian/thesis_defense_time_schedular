// src/pages/student/StudentThesisForms.tsx

import React, {useState} from 'react';
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {studentAPI} from '../../api/student.api';
import {ThesisForm, FormState, ThesisFormInput} from '../../types';
import {useAuthStore} from '../../store/authStore';
import {Link} from 'react-router-dom';
import {FileText, Clock, CheckCircle, XCircle, AlertCircle, Edit3, Send, ChevronDown, ChevronUp} from 'lucide-react';
import {EditFormModal} from '../../components/thesis/EditFormModal';
import {SubmitRevisionModal} from '../../components/thesis/SubmitRevisionModal';
import {useTranslation} from "react-i18next";

const getStatusInfo = (state: FormState, t: (key: string) => string) => {
    const statusMap: Record<FormState, {
        label: string;
        bgColor: string;
        textColor: string;
        borderColor: string;
        icon: React.ReactNode;
        description: string;
    }> = {
        [FormState.SUBMITTED]: {
            label: t("submitted"),
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-700',
            borderColor: 'border-blue-200',
            icon: <Clock size={16}/>,
            description: t("waiting_for_instructor_review")
        },
        [FormState.INSTRUCTOR_APPROVED]: {
            label: t("instructor_approved"),
            bgColor: 'bg-green-50',
            textColor: 'text-green-700',
            borderColor: 'border-green-200',
            icon: <CheckCircle size={16}/>,
            description: t("approved_by_instructor_waiting_for_admin_review")
        },
        [FormState.INSTRUCTOR_REJECTED]: {
            label: t("instructor_rejected"),
            bgColor: 'bg-red-50',
            textColor: 'text-red-700',
            borderColor: 'border-red-200',
            icon: <XCircle size={16}/>,
            description: t("rejected_by_instructor")
        },
        [FormState.INSTRUCTOR_REVISION_REQUESTED]: {
            label: t("revision_requested"),
            bgColor: 'bg-amber-50',
            textColor: 'text-amber-700',
            borderColor: 'border-amber-200',
            icon: <AlertCircle size={16}/>,
            description: t("instructor_requested_changes_to_your_form")
        },
        [FormState.ADMIN_APPROVED]: {
            label: t("admin_approved"),
            bgColor: 'bg-green-50',
            textColor: 'text-green-700',
            borderColor: 'border-green-200',
            icon: <CheckCircle size={16}/>,
            description: t("approved_by_admin_waiting_for_manager_review")
        },
        [FormState.ADMIN_REJECTED]: {
            label: t("admin_rejected"),
            bgColor: 'bg-red-50',
            textColor: 'text-red-700',
            borderColor: 'border-red-200',
            icon: <XCircle size={16}/>,
            description: t("rejected_by_admin")
        },
        [FormState.ADMIN_REVISION_REQUESTED_FOR_STUDENT]: {
            label: t("revision_requested"),
            bgColor: 'bg-amber-50',
            textColor: 'text-amber-700',
            borderColor: 'border-amber-200',
            icon: <AlertCircle size={16}/>,
            description: t("admin_requested_changes_to_your_form")
        },
        [FormState.ADMIN_REVISION_REQUESTED_FOR_INSTRUCTOR]: {
            label: t("under_review"),
            bgColor: 'bg-purple-50',
            textColor: 'text-purple-700',
            borderColor: 'border-purple-200',
            icon: <Clock size={16}/>,
            description: t("admin_requested_instructor_to_review")
        },
        [FormState.MANAGER_APPROVED]: {
            label: t("manager_approved"),
            bgColor: 'bg-emerald-50',
            textColor: 'text-emerald-700',
            borderColor: 'border-emerald-200',
            icon: <CheckCircle size={16}/>,
            description: t("fully_approved_defense_meeting_will_be_scheduled")
        },
        [FormState.MANAGER_REJECTED]: {
            label: t("manager_rejected"),
            bgColor: 'bg-red-50',
            textColor: 'text-red-700',
            borderColor: 'border-red-200',
            icon: <XCircle size={16}/>,
            description: t("rejected_by_manager")
        },
        [FormState.MANAGER_REVISION_REQUESTED_FOR_STUDENT]: {
            label: t("revision_requested"),
            bgColor: 'bg-amber-50',
            textColor: 'text-amber-700',
            borderColor: 'border-amber-200',
            icon: <AlertCircle size={16}/>,
            description: t("manager_requested_changes_to_your_form")
        },
        [FormState.MANAGER_REVISION_REQUESTED_FOR_INSTRUCTOR]: {
            label: t("under_review"),
            bgColor: 'bg-purple-50',
            textColor: 'text-purple-700',
            borderColor: 'border-purple-200',
            icon: <Clock size={16}/>,
            description: t("manager_requested_instructor_to_review")
        },
        [FormState.MANAGER_REVISION_REQUESTED_FOR_ADMIN]: {
            label: t("under_review"),
            bgColor: 'bg-purple-50',
            textColor: 'text-purple-700',
            borderColor: 'border-purple-200',
            icon: <Clock size={16}/>,
            description: t("manager_requested_admin_to_review")
        }
    };

    return statusMap[state] || {
        label: state,
        bgColor: 'bg-gray-50',
        textColor: 'text-gray-700',
        borderColor: 'border-gray-200',
        icon: <FileText size={16}/>,
        description: t("unknown_status")
    };
};

// Helper to check if form is in student revision requested state
const isStudentRevisionRequested = (state: FormState): boolean => {
    return [
        FormState.INSTRUCTOR_REVISION_REQUESTED,
        FormState.ADMIN_REVISION_REQUESTED_FOR_STUDENT,
        FormState.MANAGER_REVISION_REQUESTED_FOR_STUDENT].includes(state);
};

// Get the requester name for display
const getRevisionRequester = (state: FormState): string => {
    switch (state) {
        case FormState.INSTRUCTOR_REVISION_REQUESTED:
            return 'Instructor';
        case FormState.ADMIN_REVISION_REQUESTED_FOR_STUDENT:
            return 'Admin';
        case FormState.MANAGER_REVISION_REQUESTED_FOR_STUDENT:
            return 'Manager';
        default:
            return 'Unknown';
    }
};

export const StudentFormsPage: React.FC = () => {
    const {role} = useAuthStore();
    const queryClient = useQueryClient();
    const [expandedFormId, setExpandedFormId] = useState<number | null>(null);

    // State for edit form modal
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [formToEdit, setFormToEdit] = useState<ThesisForm | null>(null);

    // State for submit revision modal
    const [submitRevisionModalOpen, setSubmitRevisionModalOpen] = useState(false);
    const [formToSubmitRevision, setFormToSubmitRevision] = useState<ThesisForm | null>(null);

    // Fetch student's forms
    const {data: forms = [], isLoading, error, refetch} = useQuery({
        queryKey: ['student-forms'],
        queryFn: studentAPI.getMyThesisForms,
        enabled: role === 'STUDENT'
    });

    // Mutation for editing form
    const editFormMutation = useMutation({
        mutationFn: ({formId, data}: { formId: number; data: ThesisFormInput; }) =>
            studentAPI.editForm(formId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['student-forms']});
            setEditModalOpen(false);
            setFormToEdit(null);
        },
        onError: (error: any) => {
            alert(error.response?.data?.message || 'Failed to update form');
        }
    });

    // Mutation for submitting revision
    const submitRevisionMutation = useMutation({
        mutationFn: (formId: number) => studentAPI.submitRevision(formId),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['student-forms']});
            setSubmitRevisionModalOpen(false);
            setFormToSubmitRevision(null);
        },
        onError: (error: any) => {
            alert(error.response?.data?.message || 'Failed to submit revision');
        }
    });

    // Handle opening edit form modal
    const handleEditClick = (form: ThesisForm, e: React.MouseEvent) => {
        e.stopPropagation();
        setFormToEdit(form);
        setEditModalOpen(true);
    };

    // Handle edit form save
    const handleEditSave = (data: ThesisFormInput) => {
        if (formToEdit) {
            editFormMutation.mutate({
                formId: formToEdit.id,
                data
            });
        }
    };

    // Handle edit modal close
    const handleEditModalClose = () => {
        if (!editFormMutation.isPending) {
            setEditModalOpen(false);
            setFormToEdit(null);
        }
    };

    // Handle opening submit revision modal
    const handleSubmitRevisionClick = (form: ThesisForm, e: React.MouseEvent) => {
        e.stopPropagation();
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

    // Toggle form expansion
    const toggleFormExpansion = (formId: number) => {
        setExpandedFormId(expandedFormId === formId ? null : formId);
    };

    // Format date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    const {t} = useTranslation("student");

    // Loading State
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                <div className="flex flex-col items-center gap-4">
                    <div
                        className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-600 text-lg">{t("loading_your_thesis_forms")}</p>
                </div>
            </div>);

    }

    // Error State
    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                <div className="flex flex-col items-center gap-4 text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                        <XCircle size={32} className="text-red-500"/>
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">{t("failed_to_load_forms")}</h2>
                    <p className="text-gray-600">{(error as Error).message || 'An error occurred'}</p>
                    <button
                        onClick={() => refetch()}
                        className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">{t("try_again")}


                    </button>
                </div>
            </div>);

    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            {/* Header */}
            <div className="max-w-5xl mx-auto mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">{t('thesis-forms')}</h1>
                        <p className="text-gray-500 mt-1">{t('form-description')}</p>
                    </div>
                    <Link
                        to="/student/thesis/create"
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm">

                        <FileText size={20}/>
                        {t('create-new-form')}
                    </Link>
                </div>
            </div>

            {/* Forms List */}
            <div className="max-w-5xl mx-auto">
                {forms.length === 0 ?
                    // Empty State
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                        <div
                            className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FileText size={40} className="text-gray-400" strokeWidth={1.5}/>
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 mb-2">{t('no-forms')}</h2>
                        <p className="text-gray-500 mb-6 max-w-md mx-auto">
                            {t('no-forms-subtitle')}
                        </p>
                        <Link
                            to="/student/thesis/create"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">

                            <FileText size={20}/>
                            {t('create-first-form')}
                        </Link>
                    </div> :

                    <div className="flex flex-col gap-4">
                        {forms.map((form: ThesisForm) => {
                            const statusInfo = getStatusInfo(form.state, t);
                            const isExpanded = expandedFormId === form.id;
                            const needsRevision = isStudentRevisionRequested(form.state);

                            return (
                                <div
                                    key={form.id}
                                    className={`
                    bg-white rounded-xl shadow-sm border transition-all duration-200 cursor-pointer
                    ${needsRevision ? 'border-amber-300 ring-1 ring-amber-200' : 'border-gray-200'}
                    ${isExpanded ? 'shadow-md' : 'hover:shadow-md hover:border-gray-300'}
                  `}
                                    onClick={() => toggleFormExpansion(form.id)}>

                                    {/* Revision Alert Banner */}
                                    {needsRevision &&
                                        <div
                                            className="flex items-center gap-2 px-4 py-2.5 bg-amber-50 border-b border-amber-200 rounded-t-xl">
                                            <AlertCircle size={16} className="text-amber-600 flex-shrink-0"/>
                                            <span className="text-sm font-medium text-amber-700">
                        {getRevisionRequester(form.state)}{t("requested_revisions_to_your_form")}
                  </span>
                                        </div>
                                    }

                                    {/* Card Header */}
                                    <div className="p-4 sm:p-5">
                                        <div
                                            className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <h3 className="text-lg font-semibold text-gray-800 truncate">
                                                        {form.title}
                                                    </h3>
                                                    <span
                                                        className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                            #{form.id}
                          </span>
                                                </div>
                                            </div>
                                            <div
                                                className={`
                          inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium
                          ${statusInfo.bgColor} ${statusInfo.textColor} border ${statusInfo.borderColor}
                        `}>

                                                {statusInfo.icon}
                                                <span>{statusInfo.label}</span>
                                            </div>
                                        </div>

                                        {/* Card Summary */}
                                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                                            <div className="flex flex-col">
                        <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">{t("instructor")}

                      </span>
                                                <span className="text-sm font-medium text-gray-700 mt-0.5">
                          {form.instructorFirstName} {form.instructorLastName}
                        </span>
                                            </div>
                                            <div className="flex flex-col">
                        <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">{t("submitted")}

                      </span>
                                                <span className="text-sm font-medium text-gray-700 mt-0.5">
                          {formatDate(form.createdAt)}
                        </span>
                                            </div>
                                            <div className="flex flex-col">
                        <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">{t("status")}

                      </span>
                                                <span className="text-sm font-medium text-gray-700 mt-0.5">
                          {statusInfo.description}
                        </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expanded Content */}
                                    {isExpanded &&
                                        <div className="border-t border-gray-100 p-4 sm:p-5 bg-gray-50/50">
                                            {/* Abstract */}
                                            <div className="mb-5">
                                                <h4 className="text-sm font-semibold text-gray-700 mb-2">{t("abstract")}</h4>
                                                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                                                    {form.abstractText}
                                                </p>
                                            </div>

                                            {/* Revision Message (if applicable) */}
                                            {needsRevision && form.revisionMessage &&
                                                <div className="mb-5">
                                                    <h4 className="text-sm font-semibold text-amber-700 mb-2">{t("revision_request")}

                                                    </h4>
                                                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                                        <p className="text-sm text-amber-800 leading-relaxed">
                                                            {form.revisionMessage}
                                                        </p>
                                                        {form.revisionRequestedAt &&
                                                            <span
                                                                className="block mt-2 text-xs text-amber-600">{t("requested_on")}
                                                                {formatDate(form.revisionRequestedAt)}
                              </span>
                                                        }
                                                    </div>
                                                </div>
                                            }

                                            {/* Rejection Reason (if rejected) */}
                                            {form.rejectionReason &&
                                                <div className="mb-5">
                                                    <h4 className="text-sm font-semibold text-red-700 mb-2">{t("rejection_reason")}

                                                    </h4>
                                                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                                        <p className="text-sm text-red-800 leading-relaxed">
                                                            {form.rejectionReason}
                                                        </p>
                                                    </div>
                                                </div>
                                            }

                                            {/* Timeline */}
                                            <div className="mb-5">
                                                <h4 className="text-sm font-semibold text-gray-700 mb-2">{t("timeline")}</h4>
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex items-center justify-between text-sm">
                                                        <span className="text-gray-500">{t("created")}</span>
                                                        <span className="text-gray-700 font-medium">
                              {formatDate(form.createdAt)}
                            </span>
                                                    </div>
                                                    {form.updatedAt && form.updatedAt !== form.createdAt &&
                                                        <div className="flex items-center justify-between text-sm">
                                                            <span className="text-gray-500">{t("last_updated")}</span>
                                                            <span className="text-gray-700 font-medium">
                                {formatDate(form.updatedAt)}
                              </span>
                                                        </div>
                                                    }
                                                </div>
                                            </div>

                                            {/* Actions for Revision States */}
                                            {needsRevision &&
                                                <div
                                                    className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                                                    <button
                                                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                                        onClick={(e) => handleEditClick(form, e)}
                                                        disabled={editFormMutation.isPending || submitRevisionMutation.isPending}>

                                                        <Edit3 size={16}/>{t("edit_form")}

                                                    </button>
                                                    <button
                                                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                                        onClick={(e) => handleSubmitRevisionClick(form, e)}
                                                        disabled={editFormMutation.isPending || submitRevisionMutation.isPending}>

                                                        <Send size={16}/>{t("submit_revision")}

                                                    </button>
                                                </div>
                                            }
                                        </div>
                                    }

                                    {/* Expand Indicator */}
                                    <div
                                        className="flex items-center justify-center gap-1.5 py-2 border-t border-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                                        {isExpanded ?
                                            <>
                                                <ChevronUp size={16}/>
                                                <span className="text-xs font-medium">{t("click_to_collapse")}</span>
                                            </> :

                                            <>
                                                <ChevronDown size={16}/>
                                                <span className="text-xs font-medium">{t("click_to_expand")}</span>
                                            </>
                                        }
                                    </div>
                                </div>);

                        })}
                    </div>
                }
            </div>

            {/* Edit Form Modal */}
            <EditFormModal
                isOpen={editModalOpen}
                onClose={handleEditModalClose}
                onSave={handleEditSave}
                form={formToEdit}
                isLoading={editFormMutation.isPending}/>


            {/* Submit Revision Modal */}
            <SubmitRevisionModal
                isOpen={submitRevisionModalOpen}
                onClose={handleSubmitRevisionModalClose}
                onConfirm={handleSubmitRevisionConfirm}
                thesisTitle={formToSubmitRevision?.title || ''}
                revisionMessage={formToSubmitRevision?.revisionMessage || ''}
                requestedBy={formToSubmitRevision ? getRevisionRequester(formToSubmitRevision.state) : ''}
                requestedAt={formToSubmitRevision?.revisionRequestedAt}
                isLoading={submitRevisionMutation.isPending}/>

        </div>);

};

export default StudentFormsPage;