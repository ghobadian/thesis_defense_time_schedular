import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminAPI } from '../../api/admin.api';
import './AdminThesisFormsPage.css';

interface ThesisForm {
    id: number;
    title: string;
    abstractText: string;
    studentId: number;
    studentFirstName?: string;
    studentLastName?: string;
    instructorFirstName?: string;
    instructorLastName?: string;
    createdAt: string;
    state: string;
    fieldName?: string;
    departmentName?: string;
}

const AdminThesisFormsPage: React.FC = () => {
    const [selectedForm, setSelectedForm] = useState<ThesisForm | null>(null);
    const queryClient = useQueryClient();

    // Fetch forms using React Query
    const { data: forms = [], isLoading, error } = useQuery({
        queryKey: ['admin-forms'],
        queryFn: adminAPI.getForms,
    });

    // Approve form mutation
    const approveMutation = useMutation({
        mutationFn: (formId: number) => adminAPI.approveForm(formId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-forms'] });
            setSelectedForm(null);
            alert('Form approved successfully');
        },
        onError: (error: any) => {
            alert(error.response?.data?.message || 'Failed to approve form');
        },
    });

    // Reject form mutation
    const rejectMutation = useMutation({
        mutationFn: (formId: number) => adminAPI.rejectForm(formId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-forms'] });
            setSelectedForm(null);
            alert('Form rejected successfully');
        },
        onError: (error: any) => {
            alert(error.response?.data?.message || 'Failed to reject form');
        },
    });

    const handleApprove = async (formId: number) => {
        if (!window.confirm('Are you sure you want to approve this thesis form?')) {
            return;
        }
        approveMutation.mutate(formId);
    };

    const handleReject = async (formId: number) => {
        if (!window.confirm('Are you sure you want to reject this thesis form?')) {
            return;
        }
        rejectMutation.mutate(formId);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getFullName = (firstName?: string, lastName?: string) => {
        if (firstName && lastName) {
            return `${firstName} ${lastName}`;
        }
        return firstName || lastName || 'N/A';
    };

    const actionLoading = approveMutation.isPending || rejectMutation.isPending;

    if (isLoading) {
        return (
            <div className="admin-forms-container">
                <div className="loading-spinner">Loading thesis forms...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="admin-forms-container">
                <div className="error-message">
                    {error instanceof Error ? error.message : 'Failed to fetch forms'}
                </div>
                <button
                    onClick={() => queryClient.invalidateQueries({ queryKey: ['admin-forms'] })}
                    className="btn-retry"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="admin-forms-container">
            <div className="page-header">
                <h1>Thesis Forms - Admin Review</h1>
                <div className="stats">
                    <span className="stat-badge">
                        {forms.length} form{forms.length !== 1 ? 's' : ''} pending review
                    </span>
                </div>
            </div>

            {forms.length === 0 ? (
                <div className="empty-state">
                    <p>No thesis forms pending admin review</p>
                </div>
            ) : (
                <div className="forms-layout">
                    <div className="forms-list">
                        {forms.map((form: ThesisForm) => (
                            <div
                                key={form.id}
                                className={`form-card ${selectedForm?.id === form.id ? 'selected' : ''}`}
                                onClick={() => setSelectedForm(form)}
                            >
                                <div className="form-card-header">
                                    <h3>{form.title}</h3>
                                    <span className="form-badge instructor-approved">
                                        Instructor Approved
                                    </span>
                                </div>
                                <div className="form-card-body">
                                    <p className="form-abstract">
                                        {form.abstractText.substring(0, 150)}...
                                    </p>
                                    <div className="form-meta">
                                        <span>Student: {getFullName(form.studentFirstName, form.studentLastName)}</span>
                                        <span>Submitted: {formatDate(form.createdAt)}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {selectedForm && (
                        <div className="form-details">
                            <div className="details-header">
                                <h2>Form Details</h2>
                                <button
                                    className="btn-close"
                                    onClick={() => setSelectedForm(null)}
                                >
                                    ×
                                </button>
                            </div>

                            <div className="details-content">
                                <div className="detail-section">
                                    <h3>Title</h3>
                                    <p>{selectedForm.title}</p>
                                </div>

                                <div className="detail-section">
                                    <h3>Abstract</h3>
                                    <p className="abstract-full">{selectedForm.abstractText}</p>
                                </div>

                                <div className="detail-section">
                                    <h3>Student Information</h3>
                                    <div className="info-grid">
                                        <div>
                                            <label>Student ID:</label>
                                            <span>{selectedForm.studentId}</span>
                                        </div>
                                        <div>
                                            <label>First Name:</label>
                                            <span>{selectedForm.studentFirstName || 'N/A'}</span>
                                        </div>
                                        <div>
                                            <label>Last Name:</label>
                                            <span>{selectedForm.studentLastName || 'N/A'}</span>
                                        </div>
                                        {selectedForm.fieldName && (
                                            <div>
                                                <label>Field:</label>
                                                <span>{selectedForm.fieldName}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="detail-section">
                                    <h3>Instructor Information</h3>
                                    <div className="info-grid">
                                        <div>
                                            <label>First Name:</label>
                                            <span>{selectedForm.instructorFirstName || 'N/A'}</span>
                                        </div>
                                        <div>
                                            <label>Last Name:</label>
                                            <span>{selectedForm.instructorLastName || 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="detail-section">
                                    <h3>Submission Date</h3>
                                    <p>{formatDate(selectedForm.createdAt)}</p>
                                </div>
                            </div>

                            <div className="details-actions">
                                <button
                                    className="btn btn-approve"
                                    onClick={() => handleApprove(selectedForm.id)}
                                    disabled={actionLoading}
                                >
                                    {actionLoading ? 'Processing...' : 'Approve Form'}
                                </button>
                                <button
                                    className="btn btn-reject"
                                    onClick={() => handleReject(selectedForm.id)}
                                    disabled={actionLoading}
                                >
                                    {actionLoading ? 'Processing...' : 'Reject Form'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminThesisFormsPage;
