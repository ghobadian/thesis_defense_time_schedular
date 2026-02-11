// src/components/professor/JuryScoresPanel.tsx

import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { professorAPI } from '../../api/professor.api';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import {
    CheckCircle,
    Clock,
    Award,
    User,
    Send,
    AlertCircle
} from 'lucide-react';
import { MeetingState, SimpleUser } from '../../types';

interface JuryScoresPanelProps {
    meetingId: number;
    meetingState: MeetingState;
    juryMembers: SimpleUser[];
    juriesScores: Record<string, number>;
    finalScore?: number | null;
    instructorId?: number;
    onScoreSubmitted?: () => void;
}

export const JuryScoresPanel: React.FC<JuryScoresPanelProps> = ({
                                                                    meetingId,
                                                                    meetingState,
                                                                    juryMembers,
                                                                    juriesScores,
                                                                    finalScore,
                                                                    instructorId,
                                                                    onScoreSubmitted
                                                                }) => {
    const { userId } = useAuthStore();
    const queryClient = useQueryClient();
    const [score, setScore] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    // Simple helper - get score by jury ID
    const getScoreForJury = (juryId: number): number | null => {
        const score = juriesScores?.[juryId.toString()];
        return score !== undefined ? score : null;
    };

    // Submit score mutation
    const submitScoreMutation = useMutation({
        mutationFn: (scoreValue: number) =>
            professorAPI.scoreMeeting({ meetingId, score: scoreValue }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['myMeetings'] });
            setScore('');
            setError(null);
            onScoreSubmitted?.();
        },
        onError: (err: any) => {
            setError(err.response?.data?.message || 'Failed to submit score');
        }
    });

    // Check if current user is a jury member
    const isCurrentUserJury = juryMembers.some(jury => jury.id === userId);

    // Get current user's score
    const currentUserScore = userId ? getScoreForJury(userId) : null;
    const hasCurrentUserScored = currentUserScore !== null;

    // Can submit only for SCHEDULED meetings and if not already scored
    const canSubmitScore =
        meetingState === MeetingState.SCHEDULED &&
        isCurrentUserJury &&
        !hasCurrentUserScored;

    const handleSubmitScore = () => {
        const scoreValue = parseFloat(score);

        if (isNaN(scoreValue)) {
            setError('Please enter a valid score');
            return;
        }

        if (scoreValue < 0 || scoreValue > 20) {
            setError('Score must be between 0 and 20');
            return;
        }

        submitScoreMutation.mutate(scoreValue);
    };

    // Calculate stats
    const totalJuries = juryMembers.length;
    const scoredCount = juryMembers.filter(j => getScoreForJury(j.id) !== null).length;
    const pendingCount = totalJuries - scoredCount;
    const allScored = scoredCount === totalJuries && totalJuries > 0;

    // Only show for SCHEDULED or COMPLETED meetings
    if (meetingState !== MeetingState.SCHEDULED && meetingState !== MeetingState.COMPLETED) {
        return null;
    }

    return (
        <div className="mt-6 space-y-4">
            <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                <Award className="h-5 w-5 mr-2 text-primary-600" />
                Jury Scores & Evaluation
            </h4>

            {/* Progress Summary */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className={`p-2 rounded-full ${allScored ? 'bg-green-100' : 'bg-yellow-100'}`}>
                    {allScored ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                        <Clock className="h-5 w-5 text-yellow-600" />
                    )}
                </div>
                <div className="flex-1">
                    <p className="font-medium text-gray-900">
                        {scoredCount} / {totalJuries} Scores Submitted
                    </p>
                    <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                        <div
                            className={`h-2 rounded-full transition-all ${
                                allScored ? 'bg-green-500' : 'bg-yellow-500'
                            }`}
                            style={{ width: `${totalJuries > 0 ? (scoredCount / totalJuries) * 100 : 0}%` }}
                        />
                    </div>
                </div>
                {finalScore !== null && finalScore !== undefined && (
                    <div className="text-right">
                        <p className="text-sm text-gray-500">Final Score</p>
                        <p className="text-xl font-bold text-primary-600">
                            {Number(finalScore).toFixed(2)}
                        </p>
                    </div>
                )}
            </div>

            {/* Jury Scores List */}
            <Card className="overflow-hidden">
                <div className="divide-y divide-gray-200">
                    {juryMembers.map((jury) => {
                        const juryScore = getScoreForJury(jury.id);
                        const hasScored = juryScore !== null;
                        const isInstructor = jury.id === instructorId;
                        const isCurrentUser = jury.id === userId;

                        return (
                            <div
                                key={jury.id}
                                className={`p-4 flex items-center justify-between ${
                                    isCurrentUser ? 'bg-primary-50' : ''
                                }`}
                            >
                                <div className="flex items-center">
                                    <div className={`p-2 rounded-full ${
                                        isCurrentUser
                                            ? 'bg-primary-200'
                                            : isInstructor
                                                ? 'bg-yellow-100'
                                                : 'bg-gray-100'
                                    }`}>
                                        <User className={`h-5 w-5 ${
                                            isCurrentUser
                                                ? 'text-primary-700'
                                                : isInstructor
                                                    ? 'text-yellow-600'
                                                    : 'text-gray-600'
                                        }`} />
                                    </div>
                                    <div className="ml-3">
                                        <p className="font-medium text-gray-900 flex items-center gap-2">
                                            {jury.firstName} {jury.lastName}
                                            {isCurrentUser && (
                                                <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">
                                                    You
                                                </span>
                                            )}
                                            {isInstructor && (
                                                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                                                    Instructor
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                </div>

                                {/* Score Display */}
                                <div className="flex items-center">
                                    {hasScored ? (
                                        <div className="flex items-center gap-2">
                                            <div className="text-right">
                                                <span className="text-xl font-bold text-gray-900">
                                                    {juryScore.toFixed(1)}
                                                </span>
                                                <span className="text-sm text-gray-500 ml-1">/ 20</span>
                                            </div>
                                            <CheckCircle className="h-5 w-5 text-green-500" />
                                        </div>
                                    ) : (
                                        <div className="flex items-center text-yellow-600">
                                            <Clock className="h-5 w-5 mr-2" />
                                            <span className="text-sm font-medium">Pending</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </Card>

            {/* Score Submission Form */}
            {canSubmitScore && (
                <Card className="p-4 border-2 border-primary-200 bg-primary-50">
                    <h5 className="font-medium text-gray-900 mb-3 flex items-center">
                        <Send className="h-4 w-4 mr-2 text-primary-600" />
                        Submit Your Score
                    </h5>

                    {error && (
                        <div className="mb-3 flex items-center text-red-600 bg-red-50 p-3 rounded-lg">
                            <AlertCircle className="h-4 w-4 mr-2" />
                            <span className="text-sm">{error}</span>
                        </div>
                    )}

                    <div className="flex items-end gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Score (0-20)
                            </label>
                            <input
                                type="number"
                                min="0"
                                max="20"
                                step="0.25"
                                value={score}
                                onChange={(e) => {
                                    setScore(e.target.value);
                                    setError(null);
                                }}
                                placeholder="Enter score..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                disabled={submitScoreMutation.isPending}
                            />
                        </div>
                        <Button
                            onClick={handleSubmitScore}
                            isLoading={submitScoreMutation.isPending}
                            disabled={!score || submitScoreMutation.isPending}
                        >
                            <Send className="h-4 w-4 mr-2" />
                            Submit
                        </Button>
                    </div>

                    <p className="mt-2 text-xs text-yellow-700">
                        ⚠️ Once submitted, your score cannot be changed.
                    </p>
                </Card>
            )}

            {/* Already Scored Message */}
            {isCurrentUserJury && hasCurrentUserScored && meetingState === MeetingState.SCHEDULED && (
                <div className="flex items-center p-4 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    <div>
                        <p className="font-medium text-green-800">
                            Your score submitted: {currentUserScore?.toFixed(1)} / 20
                        </p>
                        {pendingCount > 0 && (
                            <p className="text-sm text-green-600">
                                Waiting for {pendingCount} more jury member{pendingCount > 1 ? 's' : ''}
                            </p>
                        )}
                    </div>
                </div>
            )}

            {/* Meeting Completed */}
            {meetingState === MeetingState.COMPLETED && finalScore !== null && (
                <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-center">
                    <Award className="h-10 w-10 text-green-600 mx-auto mb-2" />
                    <h5 className="text-lg font-semibold text-gray-900">Defense Completed</h5>
                    <p className="text-3xl font-bold text-green-600 mt-2">
                        {Number(finalScore).toFixed(2)} / 20
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Final Average Score</p>
                </Card>
            )}
        </div>
    );
};
