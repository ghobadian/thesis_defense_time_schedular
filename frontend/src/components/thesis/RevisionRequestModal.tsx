// src/components/thesis/RevisionRequestModal.tsx

import React, {useState, useEffect} from 'react';
import {RevisionTarget} from '../../types';
import {X, AlertCircle, Send} from 'lucide-react';
import './RevisionRequestModal.css'; //TODO remove css files
import i18n from "i18next";
import {useTranslation} from "react-i18next";

const t = i18n.t.bind(i18n);

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (target: RevisionTarget, message: string) => void;
    thesisTitle: string;
    availableTargets: RevisionTarget[];
    isLoading: boolean;
}

const TARGET_LABELS: Record<RevisionTarget, string> = {
    [RevisionTarget.STUDENT]: 'Student',
    [RevisionTarget.INSTRUCTOR]: 'Instructor',
    [RevisionTarget.ADMIN]: 'Admin'
};

const TARGET_DESCRIPTIONS: Record<RevisionTarget, string> = {
    [RevisionTarget.STUDENT]: t("request_the_student_to_revise_and_resubmit_the_for"),
    [RevisionTarget.INSTRUCTOR]: t("request_the_instructor_to_rereview_and_reapprove_t"),
    [RevisionTarget.ADMIN]: t("request_the_admin_to_rereview_and_reapprove_the_fo")
};

export const RevisionRequestModal: React.FC<Props> = ({
                                                          isOpen,
                                                          onClose,
                                                          onConfirm,
                                                          thesisTitle,
                                                          availableTargets,
                                                          isLoading
                                                      }) => {
    const {t} = useTranslation("thesis");
    const [selectedTarget, setSelectedTarget] = useState<RevisionTarget | null>(null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState<string | null>(null);

    // Reset state when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            // Auto-select if only one target available
            if (availableTargets.length === 1) {
                setSelectedTarget(availableTargets[0]);
            } else {
                setSelectedTarget(null);
            }
            setMessage('');
            setError(null);
        }
    }, [isOpen, availableTargets]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!selectedTarget) {
            setError('Please select who should make the revision.');
            return;
        }

        if (message.trim().length < 10) {
            setError('Please provide a detailed revision message (at least 10 characters).');
            return;
        }

        onConfirm(selectedTarget, message.trim());
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content revision-modal" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="modal-header">
                    <h2>{t("request_revision")}</h2>
                    <button
                        className="modal-close-btn"
                        onClick={onClose}
                        disabled={isLoading}
                        aria-label={t("close_modal")}>

                        <X size={20}/>
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="modal-body">
                    {/* Thesis Title Display */}
                    <div className="thesis-title-display">
                        <span className="label">{t("thesis")}</span>
                        <span className="title">{thesisTitle}</span>
                    </div>

                    {/* Target Selection */}
                    {availableTargets.length > 1 &&
                        <div className="form-group">
                            <label className="form-label">{t("who_should_make_the_revision")}
                                <span className="required">*</span>
                            </label>
                            <div className="target-options">
                                {availableTargets.map((target) =>
                                    <label
                                        key={target}
                                        className={`target-option ${selectedTarget === target ? 'selected' : ''}`}>

                                        <input
                                            type="radio"
                                            name="revisionTarget"
                                            value={target}
                                            checked={selectedTarget === target}
                                            onChange={() => setSelectedTarget(target)}
                                            disabled={isLoading}/>

                                        <div className="target-content">
                                            <span className="target-label">{TARGET_LABELS[target]}</span>
                                            <span className="target-description">
                                                {TARGET_DESCRIPTIONS[target]}
                                            </span>
                                        </div>
                                    </label>
                                )}
                            </div>
                        </div>
                    }

                    {/* Single target info display */}
                    {availableTargets.length === 1 && selectedTarget &&
                        <div className="single-target-info">
                            <span className="label">{t("revision_will_be_requested_from")}</span>
                            <span className="target-badge">{TARGET_LABELS[selectedTarget]}</span>
                            <p className="target-description">{TARGET_DESCRIPTIONS[selectedTarget]}</p>
                        </div>
                    }

                    {/* Revision Message */}
                    <div className="form-group">
                        <label htmlFor="revisionMessage" className="form-label">{t("revision_message")}
                            <span className="required">*</span>
                        </label>
                        <textarea
                            id="revisionMessage"
                            className="form-textarea"
                            placeholder={t("please_describe_what_needs_to_be_revised_and_why")}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            disabled={isLoading}
                            rows={5}
                            maxLength={1000}/>

                        <div className="textarea-footer">
                            <span className="char-count">
                                {message.length}{t("1000_characters")}
              </span>{message.length > 0 && message.length < 10 &&
                            <span className="min-chars-warning">{t("minimum_10_characters_required")}

              </span>
                        }
                        </div>
                    </div>

                    {/* Error Display */}
                    {error &&
                        <div className="error-message">
                            <AlertCircle size={16}/>
                            <span>{error}</span>
                        </div>
                    }

                    {/* Actions */}
                    <div className="modal-actions">
                        <button
                            type="button"
                            className="btn-cancel"
                            onClick={onClose}
                            disabled={isLoading}>{t("cancel")}


                        </button>
                        <button
                            type="submit"
                            className="btn-submit btn-revision"
                            disabled={isLoading || !selectedTarget || message.trim().length < 10}>

                            {isLoading ?
                                <>
                                    <span className="spinner"/>{t("requesting")}

                                </> :

                                <>
                                    <Send size={16}/>{t("request_revision")}

                                </>
                            }
                        </button>
                    </div>
                </form>
            </div>
        </div>);

};