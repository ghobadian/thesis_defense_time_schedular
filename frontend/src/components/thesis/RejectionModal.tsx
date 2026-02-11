// src/components/thesis/RejectionModal.tsx

import React, { useState, useEffect } from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface RejectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (reason: string) => void;
    thesisTitle: string;
    isLoading?: boolean;
}

export const RejectionModal: React.FC<RejectionModalProps> = ({
                                                                  isOpen,
                                                                  onClose,
                                                                  onConfirm,
                                                                  thesisTitle,
                                                                  isLoading = false,
                                                              }) => {
    const [rejectionReason, setRejectionReason] = useState('');
    const [error, setError] = useState('');

    // Reset state when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            setRejectionReason('');
            setError('');
        }
    }, [isOpen]);

    // Handle escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen && !isLoading) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, isLoading, onClose]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const trimmedReason = rejectionReason.trim();

        if (!trimmedReason) {
            setError('Please provide a reason for rejection');
            return;
        }

        if (trimmedReason.length < 10) {
            setError('Rejection reason must be at least 10 characters');
            return;
        }

        setError('');
        onConfirm(trimmedReason);
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget && !isLoading) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            onClick={handleBackdropClick}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black bg-opacity-50 transition-opacity" />

            {/* Modal */}
            <div
                className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 transform transition-all"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <div className="flex items-center space-x-2">
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                        <h3 className="text-lg font-semibold text-gray-900">
                            Reject Thesis Form
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Close modal"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit}>
                    <div className="p-4 space-y-4">
                        {/* Thesis Title Display */}
                        <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-sm text-gray-600">
                                You are about to reject:
                            </p>
                            <p className="font-medium text-gray-900 mt-1">
                                {thesisTitle}
                            </p>
                        </div>

                        {/* Rejection Reason Input */}
                        <div>
                            <label
                                htmlFor="rejection-reason"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Rejection Reason <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                id="rejection-reason"
                                value={rejectionReason}
                                onChange={(e) => {
                                    setRejectionReason(e.target.value);
                                    if (error) setError('');
                                }}
                                placeholder="Please provide a detailed reason for rejection..."
                                rows={4}
                                disabled={isLoading}
                                className={`w-full px-3 py-2 border rounded-lg resize-none transition-colors
                                    focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent
                                    disabled:bg-gray-100 disabled:cursor-not-allowed
                                    ${error ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                                autoFocus
                            />
                            {error && (
                                <p className="mt-1 text-sm text-red-600 flex items-center">
                                    <AlertTriangle className="h-4 w-4 mr-1" />
                                    {error}
                                </p>
                            )}
                            <p className="mt-1 text-xs text-gray-500">
                                Minimum 10 characters required
                            </p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end space-x-3 p-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading || !rejectionReason.trim()}
                            className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Rejecting...
                                </>
                            ) : (
                                'Reject Form'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RejectionModal;
