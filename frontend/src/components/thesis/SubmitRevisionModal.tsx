// src/components/thesis/SubmitRevisionModal.tsx

import React from 'react';
import { X, CheckCircle, MessageSquare, Clock, User } from 'lucide-react';
import './SubmitRevisionModal.css';//TODO remove css files

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    thesisTitle: string;
    revisionMessage: string;
    requestedBy: string;
    requestedAt?: string;
    isLoading: boolean;
}

export const SubmitRevisionModal: React.FC<Props> = ({
                                                         isOpen,
                                                         onClose,
                                                         onConfirm,
                                                         thesisTitle,
                                                         revisionMessage,
                                                         requestedBy,
                                                         requestedAt,
                                                         isLoading,
                                                     }) => {
    if (!isOpen) return null;

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'Unknown';
        try {
            return new Date(dateString).toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            });
        } catch {
            return dateString;
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content submit-revision-modal" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="modal-header">
                    <h2>Submit Revision</h2>
                    <button
                        className="modal-close-btn"
                        onClick={onClose}
                        disabled={isLoading}
                        aria-label="Close modal"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="modal-body">
                    {/* Thesis Title Display */}
                    <div className="thesis-title-display">
                        <span className="label">Thesis:</span>
                        <span className="title">{thesisTitle}</span>
                    </div>

                    {/* Revision Request Info */}
                    <div className="revision-info-card">
                        <div className="revision-info-header">
                            <MessageSquare size={18} />
                            <span>Revision Request Details</span>
                        </div>

                        <div className="revision-meta">
                            <div className="meta-item">
                                <User size={14} />
                                <span className="meta-label">Requested by:</span>
                                <span className="meta-value">{requestedBy}</span>
                            </div>
                            {requestedAt && (
                                <div className="meta-item">
                                    <Clock size={14} />
                                    <span className="meta-label">Requested at:</span>
                                    <span className="meta-value">{formatDate(requestedAt)}</span>
                                </div>
                            )}
                        </div>

                        <div className="revision-message-box">
                            <span className="message-label">Message:</span>
                            <p className="message-content">
                                {revisionMessage || 'No specific message provided.'}
                            </p>
                        </div>
                    </div>

                    {/* Confirmation Notice */}
                    <div className="confirmation-notice">
                        <CheckCircle size={18} />
                        <div className="notice-content">
                            <strong>Ready to submit your revision?</strong>
                            <p>
                                By clicking "Submit Revision", you confirm that you have addressed
                                the requested changes. The form will be sent back for re-approval.
                            </p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="modal-actions">
                        <button
                            type="button"
                            className="btn-cancel"
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="btn-submit btn-approve"
                            onClick={onConfirm}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <span className="spinner" />
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <CheckCircle size={16} />
                                    Submit Revision
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
