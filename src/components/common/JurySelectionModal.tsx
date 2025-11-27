import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { X, AlertCircle, CheckCircle } from 'lucide-react';
import { professorAPI } from '../../api/professor.api';
import { Modal } from './Modal';
import { Button } from './Button';
import {Professor} from "../../types";

interface JurySelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    meetingId: number;
    formId: number;
    onJuriesSelected: (juryIds: number[]) => Promise<void>;
}



export const JurySelectionModal: React.FC<JurySelectionModalProps> = ({
                                                                          isOpen,
                                                                          onClose,
                                                                          meetingId,
                                                                          formId,
                                                                          onJuriesSelected,
                                                                      }) => {
    const [selectedJuries, setSelectedJuries] = useState<number[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // Fetch all professors
    const { data: professors = [], isLoading: isProfessorsLoading } = useQuery({
        queryKey: ['all-professors'],
        queryFn: professorAPI.getAllProfessors,
        enabled: isOpen,
    });

    const handleProfessorToggle = (professorId: number) => {
        setSelectedJuries((prev) =>
            prev.includes(professorId)
                ? prev.filter((id) => id !== professorId)
                : [...prev, professorId]
        );
        setError(null);
    };

    const handleSubmit = async () => {
        if (selectedJuries.length < 3) {
            setError('Please select at least 3 jury members');
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

    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Select Jury Members">
            <div className="space-y-4">
                {/* Instructions */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                        Please select at least <strong>3 jury members</strong> for this thesis form.
                    </p>
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
                        professors.map((professor: Professor) => (
                            <label
                                key={professor.id}
                                className="flex items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedJuries.includes(professor.id)}
                                    onChange={() => handleProfessorToggle(professor.id)}
                                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                                    disabled={isSubmitting}
                                />
                                <div className="ml-3 flex-1">
                                    <p className="font-medium text-gray-900">
                                        {professor.firstName} {professor.lastName}
                                    </p>
                                    <p className="text-sm text-gray-500">{professor.email}</p>
                                </div>
                                {selectedJuries.includes(professor.id) && (
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                )}
                            </label>
                        ))
                    )}
                </div>

                {/* Selected Count */}
                <div className="text-sm text-gray-600">
                    Selected: <span className="font-semibold">{selectedJuries.length}</span> / 3 minimum
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
                        disabled={selectedJuries.length < 3}
                        className="flex-1"
                    >
                        {isSubmitting ? 'Assigning...' : 'Assign Juries'}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
