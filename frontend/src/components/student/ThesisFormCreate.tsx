import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {ArrowLeft} from 'lucide-react';
import {studentAPI} from '../../api/student.api';
import {adminAPI} from '../../api/admin.api';
import {Button} from '../common/Button';
import {Input} from '../common/Input';
import {Card} from '../common/Card';
import {Professor, ThesisFormInput} from '../../types';
import {useTranslation} from "react-i18next";

export const ThesisFormCreate: React.FC = () => {
    const {t} = useTranslation("student");
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [formData, setFormData] = useState<Partial<ThesisFormInput>>({
        title: '',
        abstractText: '',
        instructorId: undefined
    });

    const {data: fields} = useQuery({
        queryKey: ['fields'],
        queryFn: adminAPI.getAllFields
    });

    const {data: professors} = useQuery({
        queryKey: ['professors'],
        queryFn: studentAPI.getAllProfessors
    });

    const createMutation = useMutation({
        mutationFn: studentAPI.createThesisForm,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['myThesisForms']});
            alert('Thesis form created successfully!');
            // Navigate back to the thesis forms list
            navigate('/student/thesis');
        },
        onError: (error: any) => {
            alert(error.response?.data?.message || 'Failed to create thesis form');
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createMutation.mutate(formData as ThesisFormInput);
    };

    return (
        <div className="space-y-6">
            {/* Header with Back Button */}
            <div className="flex items-center space-x-4">
                <button
                    onClick={() => navigate('/student/thesis')}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors">

                    <ArrowLeft className="h-5 w-5 text-gray-600"/>
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{t("create_thesis_form")}</h1>
                    <p className="text-sm text-gray-600">{t("fill_in_the_details_below_to_submit_a_new_thesis_f")}

                    </p>
                </div>
            </div>

            {/* Form Card */}
            <Card>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        label={t("thesis_title")}
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        placeholder={t("enter_your_thesis_title")}
                        required/>


                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t("abstract")}

                        </label>
                        <textarea
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                            rows={6}
                            value={formData.abstractText}
                            onChange={(e) => setFormData({...formData, abstractText: e.target.value})}
                            placeholder={t("enter_your_thesis_abstract")}
                            required/>

                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{t("select_thesis_instructor")}

                        </label>
                        <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                            value={formData.instructorId || ''}
                            onChange={(e) => setFormData({...formData, instructorId: Number(e.target.value)})}
                            required>

                            <option value="">{t("select_an_instructor")}</option>
                            {professors?.map((professor: Professor) =>
                                <option key={professor.id} value={professor.id}>
                                    {professor.firstName} {professor.lastName}
                                </option>
                            )}
                        </select>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => navigate('/student/thesis')}>{t("cancel")}


                        </Button>
                        <Button
                            type="submit"
                            isLoading={createMutation.isPending}
                            disabled={
                                !formData.title ||
                                !formData.abstractText ||
                                !formData.instructorId
                            }>{t("submit_thesis_form")}


                        </Button>
                    </div>
                </form>
            </Card>
        </div>);

};