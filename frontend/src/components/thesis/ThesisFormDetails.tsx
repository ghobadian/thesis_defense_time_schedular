// src/components/thesis/ThesisFormDetails.tsx

import React from 'react';
import { ThesisForm } from '../../types';
import {
    formatDate,
    getStatusBadgeClass,
    getStatusLabel
} from '../utils/ThesisFormUtils';

export interface ActionButton {
    label: string;
    loadingLabel: string;
    className: string;
    onClick: () => void;
    disabled?: boolean;
}

interface Props {
    form: ThesisForm;
    actions: ActionButton[];
    actionLoading: boolean;
    onClose: () => void;
}

export const ThesisFormDetails: React.FC<Props> = ({
                                                       form,
                                                       actions,
                                                       actionLoading,
                                                       onClose
                                                   }) => (
    <div className="form-details">
        <div className="details-header">
            <h2>Form Details</h2>
            <button className="btn-close" onClick={onClose}>×</button>
        </div>

        <div className="details-content">
            <div className="detail-section">
                <h3>Title</h3>
                <p>{form.title}</p>
            </div>

            <div className="detail-section">
                <h3>Abstract</h3>
                <p className="abstract-full">{form.abstractText}</p>
            </div>

            <div className="detail-section">
                <h3>Student Information</h3>
                <div className="info-grid">
                    <div>
                        <label>Student ID:</label>
                        <span>{form.studentId}</span>
                    </div>
                    <div>
                        <label>First Name:</label>
                        <span>{form.studentFirstName || 'N/A'}</span>
                    </div>
                    <div>
                        <label>Last Name:</label>
                        <span>{form.studentLastName || 'N/A'}</span>
                    </div>
                    {form.fieldName && (
                        <div>
                            <label>Field:</label>
                            <span>{form.fieldName}</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="detail-section">
                <h3>Instructor Information</h3>
                <div className="info-grid">
                    <div>
                        <label>First Name:</label>
                        <span>{form.instructorFirstName || 'N/A'}</span>
                    </div>
                    <div>
                        <label>Last Name:</label>
                        <span>{form.instructorLastName || 'N/A'}</span>
                    </div>
                </div>
            </div>

            <div className="detail-section">
                <h3>Status</h3>
                <span className={`form-badge ${getStatusBadgeClass(form.state)}`}>
                    {getStatusLabel(form.state)}
                </span>
            </div>

            <div className="detail-section">
                <h3>Submission Date</h3>
                <p>{formatDate(form.createdAt)}</p>
            </div>

            {form.rejectionReason && (
                <div className="detail-section">
                    <h3>Rejection Reason</h3>
                    <p className="rejection-reason">{form.rejectionReason}</p>
                </div>
            )}

            {form.revisionMessage && (
                <div className="detail-section">
                    <h3>Revision Message</h3>
                    <p className="rejection-reason">{form.revisionMessage}</p>
                </div>
            )}
        </div>

        {actions.length > 0 && (
            <div className="details-actions">
                {actions.map((action, i) => (
                    <button
                        key={i}
                        className={`btn ${action.className}`}
                        onClick={action.onClick}
                        disabled={action.disabled || actionLoading}
                    >
                        {actionLoading ? action.loadingLabel : action.label}
                    </button>
                ))}
            </div>
        )}
    </div>
);
