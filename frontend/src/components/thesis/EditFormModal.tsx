// src/components/thesis/EditFormModal.tsx

import React, { useEffect, useState } from 'react';
import { ThesisForm, ThesisFormInput } from '../../types';
import { X, AlertCircle } from 'lucide-react';
import {studentAPI} from "../../api/student.api";
import {useQuery} from "@tanstack/react-query";
import { useTranslation } from 'react-i18next';

interface EditFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: ThesisFormInput) => void;
    form: ThesisForm | null;
    isLoading: boolean;
}

export const EditFormModal: React.FC<EditFormModalProps> = ({
                                                                isOpen,
                                                                onClose,
                                                                onSave,
                                                                form,
                                                                isLoading,
                                                            }) => {
    const [title, setTitle] = useState('');
    const [abstractText, setAbstractText] = useState('');
    const [instructorId, setInstructorId] = useState<number | null>(null);
    const [errors, setErrors] = useState<{
        title?: string;
        abstractText?: string;
        instructorId?: string;
    }>({});

    const { data: professors, isLoading: professorsLoading } = useQuery({
        queryKey: ['professors'],
        queryFn: studentAPI.getAllProfessors,
        enabled: isOpen,
    });
    const { t } = useTranslation();

    // Initialize form values when modal opens or form changes
    useEffect(() => {
        if (form && isOpen) {
            setTitle(form.title || '');
            setAbstractText(form.abstractText || '');
            setInstructorId(form.instructorId || null);
            setErrors({});
        }
    }, [form, isOpen]);

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

    const validateForm = (): boolean => {
        const newErrors: { title?: string; abstractText?: string; instructorId?: string} = {};

        if (!title.trim()) {
            newErrors.title = t('editFormModal.errors.titleRequired');
        } else if (title.trim().length < 10) {
            newErrors.title = t('editFormModal.errors.titleMinLength');
        } else if (title.trim().length > 200) {
            newErrors.title = t('editFormModal.errors.titleMaxLength');
        }

        if (!abstractText.trim()) {
            newErrors.abstractText = t('editFormModal.errors.abstractRequired');
        } else if (abstractText.trim().length < 50) {
            newErrors.abstractText = t('editFormModal.errors.abstractMinLength');
        } else if (abstractText.trim().length > 2000) {
            newErrors.abstractText = t('editFormModal.errors.abstractMaxLength');
        }

        if (!instructorId) {
            newErrors.instructorId = t('editFormModal.errors.instructorRequired');
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm() || !form || !instructorId) return;

        const formData: ThesisFormInput = {
            title: title.trim(),
            abstractText: abstractText.trim(),
            studentId: parseInt(form.studentId),
            instructorId: instructorId,
        };

        onSave(formData);
    };

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget && !isLoading) {
            onClose();
        }
    };

    if (!isOpen || !form) return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-lg shadow-xl max-w-[600px] w-[90%] max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-5 border-b border-gray-200 bg-gray-50 rounded-t-lg">
                    <h2 className="m-0 text-xl font-semibold text-gray-800">
                        {t('editFormModal.title')}
                    </h2>
                    <button
                        className="bg-transparent border-none text-gray-500 cursor-pointer p-1 leading-none transition-colors duration-200 hover:text-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                        onClick={onClose}
                        disabled={isLoading}
                        aria-label="Close modal"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Revision Message Banner */}
                {form.revisionMessage && (
                    <div className="bg-amber-50 border border-amber-500 rounded-md p-4 mx-6 mt-4">
                        <div className="flex items-center gap-2 mb-2">
                            <AlertCircle size={18} className="text-amber-600" />
                            <strong className="text-amber-800 text-[0.95rem]">
                                {t('editFormModal.revisionRequested')}
                            </strong>
                        </div>
                        <p className="text-amber-900 text-sm my-2 leading-relaxed whitespace-pre-wrap">
                            {form.revisionMessage}
                        </p>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6">
                    {/* Title Field */}
                    <div className="mb-5">
                        <label
                            htmlFor="thesis-title"
                            className="block font-medium text-gray-700 mb-2 text-[0.95rem]"
                        >
                            Thesis Title <span className="text-red-600">*</span>
                        </label>
                        <input
                            id="thesis-title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder={t('editFormModal.thesisTitlePlaceholder')}
                            disabled={isLoading}
                            className={`
                                w-full p-3 border rounded-md text-[0.95rem] font-inherit
                                transition-all duration-200
                                focus:outline-none focus:border-blue-500 focus:ring-[3px] focus:ring-blue-500/10
                                disabled:bg-gray-100 disabled:cursor-not-allowed
                                ${errors.title
                                ? 'border-red-600 focus:ring-red-600/10'
                                : 'border-gray-300'
                            }
                            `}
                            maxLength={200}
                        />
                        <div className="flex justify-between items-center mt-1.5 min-h-[1.25rem]">
                            {errors.title && (
                                <span className="text-red-600 text-xs">{errors.title}</span>
                            )}
                            <span className="text-gray-400 text-xs ml-auto">
                                {title.length}/200
                            </span>
                        </div>
                    </div>

                    {/* Abstract Field */}
                    <div className="mb-5">
                        <label
                            htmlFor="thesis-abstract"
                            className="block font-medium text-gray-700 mb-2 text-[0.95rem]"
                        >
                            Abstract <span className="text-red-600">*</span>
                        </label>
                        <textarea
                            id="thesis-abstract"
                            value={abstractText}
                            onChange={(e) => setAbstractText(e.target.value)}
                            placeholder="Enter your thesis abstract (minimum 50 characters)"
                            disabled={isLoading}
                            className={`
                                w-full p-3 border rounded-md text-[0.95rem] font-inherit
                                transition-all duration-200 resize-y min-h-[150px]
                                focus:outline-none focus:border-blue-500 focus:ring-[3px] focus:ring-blue-500/10
                                disabled:bg-gray-100 disabled:cursor-not-allowed
                                ${errors.abstractText
                                ? 'border-red-600 focus:ring-red-600/10'
                                : 'border-gray-300'
                            }
                            `}
                            rows={8}
                            maxLength={2000}
                        />
                        <div className="flex justify-between items-center mt-1.5 min-h-[1.25rem]">
                            {errors.abstractText && (
                                <span className="text-red-600 text-xs">{errors.abstractText}</span>
                            )}
                            <span className="text-gray-400 text-xs ml-auto">
                                {abstractText.length}/2000
                            </span>
                        </div>
                    </div>

                    {/* Instructor Selection */}
                    <div className="mb-5">
                        <label
                            htmlFor="thesis-instructor"
                            className="block font-medium text-gray-700 mb-2 text-[0.95rem]"
                        >
                            {t('editFormModal.instructor', 'Instructor')} <span className="text-red-600">*</span>
                        </label>
                        <select
                            id="thesis-instructor"
                            value={instructorId || ''}
                            onChange={(e) => setInstructorId(e.target.value ? Number(e.target.value) : null)}
                            disabled={isLoading || professorsLoading}
                            className={`
            w-full p-3 border rounded-md text-[0.95rem] font-inherit
            transition-all duration-200 bg-white
            focus:outline-none focus:border-blue-500 focus:ring-[3px] focus:ring-blue-500/10
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${errors.instructorId
                                ? 'border-red-600 focus:ring-red-600/10'
                                : 'border-gray-300'
                            }
        `}
                        >
                            <option value="">
                                {professorsLoading
                                    ? t('editFormModal.loadingProfessors', 'Loading professors...')
                                    : t('editFormModal.selectInstructor', 'Select an instructor')
                                }
                            </option>
                            {professors?.map((professor: { id: number; firstName: string; lastName: string }) => (
                                <option key={professor.id} value={professor.id}>
                                    {professor.firstName} {professor.lastName}
                                </option>
                            ))}
                        </select>
                        {errors.instructorId && (
                            <span className="text-red-600 text-xs mt-1.5 block">{errors.instructorId}</span>
                        )}
                    </div>


                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            className="px-5 py-2.5 bg-white border border-gray-300 rounded-md text-gray-700 font-medium cursor-pointer transition-colors duration-200 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2.5 bg-blue-500 border-none rounded-md text-white font-medium cursor-pointer transition-colors duration-200 flex items-center gap-2 hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                    Saving...
                                </>
                            ) : (
                                'Save Changes'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
