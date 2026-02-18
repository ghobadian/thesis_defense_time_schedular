// src/components/thesis/SubmitRevisionModal.tsx

import React from 'react';
import {X, CheckCircle, MessageSquare, Clock, User} from 'lucide-react';
import './SubmitRevisionModal.css'; //TODO remove css files
import {useTranslation} from "react-i18next";

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
                                                         isLoading
                                                     }) => {
    const {t} = useTranslation("thesis");
    if (!isOpen) return null;

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'Unknown';
        try {
            return new Date(dateString).toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
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
                    <h2>{t("submit_revision")}</h2>
                    <button
                        className="modal-close-btn"
                        onClick={onClose}
                        disabled={isLoading}
                        aria-label={t("close_modal")}>

                        <X size={20}/>
                    </button>
                </div>

                {/* Body */}
                <div className="modal-body">
                    {/* Thesis Title Display */}
                    <div className="thesis-title-display">
                        <span className="label">{t("thesis")}</span>
                        <span className="title">{thesisTitle}</span>
                    </div>

                    {/* Revision Request Info */}
                    <div className="revision-info-card">
                        <div className="revision-info-header">
                            <MessageSquare size={18}/>
                            <span>{t("revision_request_details")}</span>
                        </div>

                        <div className="revision-meta">
                            <div className="meta-item">
                                <User size={14}/>
                                <span className="meta-label">{t("requested_by")}</span>
                                <span className="meta-value">{requestedBy}</span>
                            </div>
                            {requestedAt &&
                                <div className="meta-item">
                                    <Clock size={14}/>
                                    <span className="meta-label">{t("requested_at")}</span>
                                    <span className="meta-value">{formatDate(requestedAt)}</span>
                                </div>
                            }
                        </div>

                        <div className="revision-message-box">
                            <span className="message-label">{t("message")}</span>
                            <p className="message-content">
                                {revisionMessage || 'No specific message provided.'}
                            </p>
                        </div>
                    </div>

                    {/* Confirmation Notice */}
                    <div className="confirmation-notice">
                        <CheckCircle size={18}/>
                        <div className="notice-content">
                            <strong>{t("ready_to_submit_your_revision")}</strong>
                            <p>{t("by_clicking_submit_revision_you_confirm_that_you_h")}


                            </p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="modal-actions">
                        <button
                            type="button"
                            className="btn-cancel"
                            onClick={onClose}
                            disabled={isLoading}>{t("cancel")}


                        </button>
                        <button
                            type="button"
                            className="btn-submit btn-approve"
                            onClick={onConfirm}
                            disabled={isLoading}>

                            {isLoading ?
                                <>
                                    <span className="spinner"/>{t("submitting")}

                                </> :

                                <>
                                    <CheckCircle size={16}/>{t("submit_revision")}

                                </>
                            }
                        </button>
                    </div>
                </div>
            </div>
        </div>);

};