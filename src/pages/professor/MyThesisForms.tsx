import React, {useState} from 'react';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {Card} from '../../components/common/Card';
import {Button} from '../../components/common/Button';
import {professorAPI} from '../../api/professor.api';
import {Calendar, CheckCircle, Clock, Eye, FileText, Filter, User, XCircle} from 'lucide-react';
import {FormState, ThesisForm, UserRole} from "../../types";
import {useAuthStore} from "../../store/authStore";

export const MyThesisForms: React.FC = () => {
    const queryClient = useQueryClient();
    const [selectedForm, setSelectedForm] = useState<ThesisForm | null>(null);
    const [filterState, setFilterState] = useState<string>('ALL');
    const [reviewComment, setReviewComment] = useState('');
    const {role} = useAuthStore();

    const { data: forms, isLoading } = useQuery<ThesisForm[]>({
        queryKey: ['professorThesisForms'],
        queryFn: professorAPI.getPendingThesisForms,
    });


    const approveMutation = useMutation({
        mutationFn: (formId: number) => professorAPI.approveThesisForm(formId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['professorThesisForms'] });
            queryClient.invalidateQueries({ queryKey: ['pendingThesisForms'] });
            alert('Thesis form approved successfully!');
            setSelectedForm(null);
        },
        onError: (error: any) => {
            alert(error.response?.data?.message || 'Failed to approve form');
        },
    });

    const rejectMutation = useMutation({
        mutationFn: ({ formId, comment }: { formId: number; comment: string }) =>
            professorAPI.rejectThesisForm(formId, comment),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['professorThesisForms'] });
            queryClient.invalidateQueries({ queryKey: ['pendingThesisForms'] });
            alert('Thesis form rejected');
            setSelectedForm(null);
            setReviewComment('');
        },
        onError: (error: any) => {
            alert(error.response?.data?.message || 'Failed to reject form');
        },
    });

    const getStateColor = (state: string) => {
        switch (state) {
            case 'SUBMITTED':
                return 'bg-yellow-100 text-yellow-800';
            case 'INSTRUCTOR_APPROVED':
            case 'ADMIN_APPROVED':
            case 'MANAGER_APPROVED':
                return 'bg-green-100 text-green-800';
            case 'INSTRUCTOR_REJECTED':
            case 'MANAGER_REJECTED':
            case 'ADMIN_REJECTED':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const filteredForms = forms?.filter(form =>
        filterState === 'ALL' || form.state === filterState
    );

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-600">Loading thesis forms...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">My Thesis Forms</h1>

                {/* Filter Dropdown */}
                <div className="flex items-center space-x-2">
                    <Filter className="h-5 w-5 text-gray-500" />
                    <select
                        value={filterState}
                        onChange={(e) => setFilterState(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                        <option value="ALL">All Forms</option>
                        <option value="SUBMITTED">Pending Review</option>
                        <option value="INSTRUCTOR_APPROVED">Approved</option>
                        <option value="INSTRUCTOR_REJECTED">Rejected</option>
                    </select>
                </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-gray-50">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">Total Forms</p>
                            <p className="text-2xl font-bold text-gray-900">{forms?.length || 0}</p>
                        </div>
                        <FileText className="h-8 w-8 text-gray-600" />
                    </div>
                </Card>

                <Card className="bg-yellow-50">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-yellow-600 text-sm font-medium">Pending</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {forms?.filter(f => f.state === 'SUBMITTED').length || 0}
                            </p>
                        </div>
                        <Clock className="h-8 w-8 text-yellow-600" />
                    </div>
                </Card>

                <Card className="bg-green-50">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-600 text-sm font-medium">Approved</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {forms?.filter(f => f.state === FormState.ADMIN_APPROVED).length || 0}
                            </p>
                        </div>
                        <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                </Card>

                <Card className="bg-red-50">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-red-600 text-sm font-medium">Rejected</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {forms?.filter(f => f.state === FormState.INSTRUCTOR_REJECTED).length || 0}
                            </p>
                        </div>
                        <XCircle className="h-8 w-8 text-red-600" />
                    </div>
                </Card>
            </div>

            {/* Thesis Forms List */}
            <div className="space-y-4">
                {!filteredForms || filteredForms.length === 0 ? (
                    <Card>
                        <div className="text-center py-12">
                            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-600 text-lg">No thesis forms found</p>
                            <p className="text-gray-500 text-sm mt-2">
                                {filterState !== 'ALL'
                                    ? 'Try changing the filter to see more forms'
                                    : 'Forms will appear here when students submit them'
                                }
                            </p>
                        </div>
                    </Card>
                ) : (
                    filteredForms.map((form: ThesisForm) => (
                        <Card key={form.id} className="hover:shadow-lg transition-shadow">
                            <div className="space-y-4">
                                {/* Header */}
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                            {form.title}
                                        </h3>
                                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                                            <div className="flex items-center space-x-1">
                                                <User className="h-4 w-4" />
                                                <span>{form.studentFirstName} {form.studentLastName}</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <FileText className="h-4 w-4" />
                                                <span>{form.fieldName}</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <Calendar className="h-4 w-4" />
                                                <span>{new Date(form.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStateColor(form.state)}`}>
                    {form.state.replace(/_/g, ' ')}
                  </span>
                                </div>

                                {/* Abstract Preview */}
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-sm text-gray-700 line-clamp-3">
                                        {form.abstractText}
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className="flex justify-end space-x-2 pt-2 border-t border-gray-200">
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => setSelectedForm(form)}
                                    >
                                        <Eye className="h-4 w-4 mr-1" />
                                        View Details
                                    </Button>

                                    {(form.state === 'SUBMITTED' || (form.state === 'ADMIN_APPROVED' && role == UserRole.MANAGER)) && (
                                        <>
                                            <Button
                                                size="sm"
                                                onClick={() => approveMutation.mutate(form.id)}
                                                disabled={approveMutation.isPending}
                                                className="bg-green-600 hover:bg-green-700"
                                            >
                                                <CheckCircle className="h-4 w-4 mr-1" />
                                                Approve
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                onClick={() => setSelectedForm(form)}
                                                className="text-red-600 hover:bg-red-50"
                                            >
                                                <XCircle className="h-4 w-4 mr-1" />
                                                Reject
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>

            {/* Detail Modal */}
            {selectedForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 space-y-6">
                            {/* Modal Header */}
                            <div className="flex justify-between items-start">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {selectedForm.title}
                                </h2>
                                <button
                                    onClick={() => {
                                        setSelectedForm(null);
                                        setReviewComment('');
                                    }}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <XCircle className="h-6 w-6" />
                                </button>
                            </div>

                            {/* Student Info */}
                            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                                <h3 className="font-semibold text-gray-900">Student Information</h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-600">Name:</span>
                                        <span className="ml-2 font-medium">
                      {selectedForm.studentFirstName} {selectedForm.studentLastName}
                    </span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Student Number:</span>
                                        <span className="ml-2 font-medium">{selectedForm.studentNumber}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Email:</span>
                                        <span className="ml-2 font-medium">{selectedForm.studentEmail}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Field:</span>
                                        <span className="ml-2 font-medium">{selectedForm.fieldName}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Abstract */}
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2">Abstract</h3>
                                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                                    {selectedForm.abstractText}
                                </p>
                            </div>

                            {/* Review Actions */}
                            {selectedForm.state === 'SUBMITTED' && (
                                <div className="space-y-4 pt-4 border-t border-gray-200">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Review Comment (optional for approval, required for rejection)
                                        </label>
                                        <textarea
                                            value={reviewComment}
                                            onChange={(e) => setReviewComment(e.target.value)}
                                            rows={4}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                            placeholder="Enter your feedback or reasons..."
                                        />
                                    </div>

                                    <div className="flex justify-end space-x-3">
                                        <Button
                                            variant="secondary"
                                            onClick={() => {
                                                setSelectedForm(null);
                                                setReviewComment('');
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={() => rejectMutation.mutate({
                                                formId: selectedForm.id,
                                                comment: reviewComment
                                            })}
                                            disabled={rejectMutation.isPending || !reviewComment.trim()}
                                            className="bg-red-600 hover:bg-red-700"
                                        >
                                            <XCircle className="h-4 w-4 mr-1" />
                                            Reject
                                        </Button>
                                        <Button
                                            onClick={() => approveMutation.mutate(selectedForm.id)}
                                            disabled={approveMutation.isPending}
                                            className="bg-green-600 hover:bg-green-700"
                                        >
                                            <CheckCircle className="h-4 w-4 mr-1" />
                                            Approve
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Status Info */}
                            <div className="text-xs text-gray-500 pt-2 border-t border-gray-100">
                                <div>Submitted: {new Date(selectedForm.createdAt).toLocaleString()}</div>
                                <div>Last Updated: {new Date(selectedForm.updatedAt).toLocaleString()}</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
