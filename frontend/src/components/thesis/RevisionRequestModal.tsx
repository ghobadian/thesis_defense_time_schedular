// src/components/thesis/RevisionRequestModal.tsx

import React, { useState, useEffect } from 'react';
import { RevisionTarget } from '../../types';
import { X, AlertCircle, Send } from 'lucide-react';
import './RevisionRequestModal.css';//TODO remove css files

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
    [RevisionTarget.ADMIN]: 'Admin',
};

const TARGET_DESCRIPTIONS: Record<RevisionTarget, string> = {
    [RevisionTarget.STUDENT]: 'Request the student to revise and resubmit the form content.',
    [RevisionTarget.INSTRUCTOR]: 'Request the instructor to re-review and re-approve the form.',
    [RevisionTarget.ADMIN]: 'Request the admin to re-review and re-approve the form.',
};

export const RevisionRequestModal: React.FC<Props> = ({
                                                          isOpen,
                                                          onClose,
                                                          onConfirm,
                                                          thesisTitle,
                                                          availableTargets,
                                                          isLoading,
                                                      }) => {
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
                    <h2>Request Revision</h2>
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
                <form onSubmit={handleSubmit} className="modal-body">
                    {/* Thesis Title Display */}
                    <div className="thesis-title-display">
                        <span className="label">Thesis:</span>
                        <span className="title">{thesisTitle}</span>
                    </div>

                    {/* Target Selection */}
                    {availableTargets.length > 1 && (
                        <div className="form-group">
                            <label className="form-label">
                                Who should make the revision? <span className="required">*</span>
                            </label>
                            <div className="target-options">
                                {availableTargets.map((target) => (
                                    <label
                                        key={target}
                                        className={`target-option ${selectedTarget === target ? 'selected' : ''}`}
                                    >
                                        <input
                                            type="radio"
                                            name="revisionTarget"
                                            value={target}
                                            checked={selectedTarget === target}
                                            onChange={() => setSelectedTarget(target)}
                                            disabled={isLoading}
                                        />
                                        <div className="target-content">
                                            <span className="target-label">{TARGET_LABELS[target]}</span>
                                            <span className="target-description">
                                                {TARGET_DESCRIPTIONS[target]}
                                            </span>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Single target info display */}
                    {availableTargets.length === 1 && selectedTarget && (
                        <div className="single-target-info">
                            <span className="label">Revision will be requested from:</span>
                            <span className="target-badge">{TARGET_LABELS[selectedTarget]}</span>
                            <p className="target-description">{TARGET_DESCRIPTIONS[selectedTarget]}</p>
                        </div>
                    )}

                    {/* Revision Message */}
                    <div className="form-group">
                        <label htmlFor="revisionMessage" className="form-label">
                            Revision Message <span className="required">*</span>
                        </label>
                        <textarea
                            id="revisionMessage"
                            className="form-textarea"
                            placeholder="Please describe what needs to be revised and why..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            disabled={isLoading}
                            rows={5}
                            maxLength={1000}
                        />
                        <div className="textarea-footer">
                            <span className="char-count">
                                {message.length}/1000 characters
                            </span>{message.length > 0 && message.length < 10 && (
                            <span className="min-chars-warning">
                                    Minimum 10 characters required
                                </span>
                        )}
                        </div>
                    </div>

                    {/* Error Display */}
                    {error && (
                        <div className="error-message">
                            <AlertCircle size={16} />
                            <span>{error}</span>
                        </div>
                    )}

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
                            type="submit"
                            className="btn-submit btn-revision"
                            disabled={isLoading || !selectedTarget || message.trim().length < 10}
                        >
                            {isLoading ? (
                                <>
                                    <span className="spinner" />
                                    Requesting...
                                </>
                            ) : (
                                <>
                                    <Send size={16} />
                                    Request Revision
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
