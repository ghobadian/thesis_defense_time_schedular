import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { X, AlertCircle, CheckCircle, Lock } from 'lucide-react';
import { professorAPI } from '../../api/professor.api';
import { Modal } from './Modal';
import { Button } from './Button';
import { Professor } from "../../types";

// Configuration constants - can be moved to a separate config file
export const JURY_SELECTION_CONFIG = {
    MIN_JURY_MEMBERS: 3,
    MAX_JURY_MEMBERS: 10, // Optional: you can also add a max limit
};

interface JurySelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    meetingId: number;
    formId: number;
    onJuriesSelected: (juryIds: number[]) => Promise<void>;
    minJuryCount?: number;
    maxJuryCount?: number;
    instructorId?: number; // NEW: instructor ID to be pre-selected and locked
}

export const JurySelectionModal: React.FC<JurySelectionModalProps> = ({
                                                                          isOpen,
                                                                          onClose,
                                                                          meetingId,
                                                                          formId,
                                                                          onJuriesSelected,
                                                                          minJuryCount = JURY_SELECTION_CONFIG.MIN_JURY_MEMBERS,
                                                                          maxJuryCount,
                                                                          instructorId, // NEW prop
                                                                      }) => {
    const [selectedJuries, setSelectedJuries] = useState<number[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // Reset state when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            // When modal opens, pre-select the instructor if provided
            if (instructorId) {
                setSelectedJuries([instructorId]);
            } else {
                setSelectedJuries([]);
            }
            setError(null);
            setSuccess(false);
        } else {
            setSelectedJuries([]);
            setError(null);
            setSuccess(false);
        }
    }, [isOpen, instructorId]);

    // Fetch all professors
    const { data: professors = [], isLoading: isProfessorsLoading } = useQuery({
        queryKey: ['all-professors'],
        queryFn: professorAPI.getAllProfessors,
        enabled: isOpen,
    });

    const handleProfessorToggle = (professorId: number) => {
        // Prevent unselecting the instructor
        if (professorId === instructorId) {
            setError('The instructor must remain as a jury member');
            return;
        }

        setSelectedJuries((prev) => {
            const isCurrentlySelected = prev.includes(professorId);

            // If trying to add and max limit is reached, show error
            if (!isCurrentlySelected && maxJuryCount && prev.length >= maxJuryCount) {
                setError(`You can select a maximum of ${maxJuryCount} jury members`);
                return prev;
            }

            setError(null);

            return isCurrentlySelected
                ? prev.filter((id) => id !== professorId)
                : [...prev, professorId];
        });
    };

    const handleSubmit = async () => {
        if (selectedJuries.length < minJuryCount) {
            setError(`Please select at least ${minJuryCount} jury member${minJuryCount !== 1 ? 's' : ''}`);
            return;
        }

        if (maxJuryCount && selectedJuries.length > maxJuryCount) {
            setError(`Please select no more than ${maxJuryCount} jury member${maxJuryCount !== 1 ? 's' : ''}`);
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            await onJuriesSelected(selectedJuries);
            setSuccess(true);

            setTimeout(() => {
                setSelectedJuries([]);
                setSuccess(false);
                onClose();
            }, 1500);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to assign juries');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Helper to generate the selection requirement text
    const getRequirementText = (): string => {
        if (maxJuryCount) {
            if (minJuryCount === maxJuryCount) {
                return `exactly ${minJuryCount} jury member${minJuryCount !== 1 ? 's' : ''}`;
            }
            return `between ${minJuryCount} and ${maxJuryCount} jury members`;
        }
        return `at least ${minJuryCount} jury member${minJuryCount !== 1 ? 's' : ''}`;
    };

    // Helper to generate the selected count text
    const getSelectedCountText = (): string => {
        const count = selectedJuries.length;
        if (maxJuryCount) {
            return `${count} / ${minJuryCount}-${maxJuryCount}`;
        }
        return `${count} / ${minJuryCount} minimum`;
    };

    // Check if submit should be disabled
    const isSubmitDisabled =
        selectedJuries.length < minJuryCount ||
        (maxJuryCount !== undefined && selectedJuries.length > maxJuryCount);

    // Helper to check if a professor is the instructor
    const isInstructor = (professorId: number): boolean => {
        return professorId === instructorId;
    };

    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Select Jury Members">
            <div className="space-y-4">
                {/* Instructions */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                        Please select <strong>{getRequirementText()}</strong> for this thesis form.
                    </p>
                    {instructorId && (
                        <p className="text-sm text-blue-600 mt-2">
                            <Lock className="inline h-4 w-4 mr-1" />
                            The thesis instructor is automatically included as a jury member.
                        </p>
                    )}
                </div>

                {/* Error Message */}
                {error && (
                    <div className="flex items-start space-x-3 bg-red-50 border border-red-200 rounded-lg p-4">
                        <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-800">{error}</p>
                    </div>
                )}

                {/* Success Message */}
                {success && (
                    <div className="flex items-start space-x-3 bg-green-50 border border-green-200 rounded-lg p-4">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-green-800">Juries assigned successfully!</p>
                    </div>
                )}

                {/* Professors List */}
                <div className="space-y-2 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-3">
                    {isProfessorsLoading ? (
                        <div className="text-center py-8 text-gray-500">
                            Loading professors...
                        </div>
                    ) : professors.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            No professors available
                        </div>
                    ) : (
                        professors.map((professor: Professor) => {
                            const isSelected = selectedJuries.includes(professor.id);
                            const isProfessorInstructor = isInstructor(professor.id);
                            const isMaxReached = maxJuryCount !== undefined &&
                                selectedJuries.length >= maxJuryCount &&
                                !isSelected;
                            const isDisabled = isSubmitting || isMaxReached || isProfessorInstructor;

                            return (
                                <label
                                    key={professor.id}
                                    className={`flex items-center p-3 rounded-lg transition-colors ${
                                        isProfessorInstructor
                                            ? 'bg-primary-50 border border-primary-200 cursor-not-allowed'
                                            : isMaxReached
                                                ? 'opacity-50 cursor-not-allowed bg-gray-50'
                                                : 'hover:bg-gray-50 cursor-pointer'
                                    }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={() => handleProfessorToggle(professor.id)}
                                        className={`w-4 h-4 border-gray-300 rounded focus:ring-primary-500 ${
                                            isProfessorInstructor
                                                ? 'text-primary-600 cursor-not-allowed'
                                                : 'text-primary-600'
                                        }`}
                                        disabled={isDisabled}
                                    />
                                    <div className="ml-3 flex-1">
                                        <p className="font-medium text-gray-900">
                                            {professor.firstName} {professor.lastName}
                                            {isProfessorInstructor && (
                                                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-800">
                                                    <Lock className="h-3 w-3 mr-1" />
                                                    Instructor
                                                </span>
                                            )}
                                        </p>
                                        <p className="text-sm text-gray-500">{professor.email}</p>
                                    </div>
                                    {isSelected && (
                                        <CheckCircle className={`h-5 w-5 ${
                                            isProfessorInstructor ? 'text-primary-600' : 'text-green-600'
                                        }`} />
                                    )}
                                </label>
                            );
                        })
                    )}
                </div>

                {/* Selected Count */}
                <div className="text-sm text-gray-600">
                    Selected: <span className={`font-semibold ${
                    selectedJuries.length >= minJuryCount ? 'text-green-600' : 'text-gray-900'
                }`}>
                        {getSelectedCountText()}
                    </span>
                    {instructorId && (
                        <span className="text-gray-500 ml-2">(including instructor)</span>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t">
                    <Button
                        variant="secondary"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="flex-1"
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="success"
                        onClick={handleSubmit}
                        isLoading={isSubmitting}
                        disabled={isSubmitDisabled}
                        className="flex-1"
                    >
                        {isSubmitting ? 'Assigning...' : 'Assign Juries'}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
