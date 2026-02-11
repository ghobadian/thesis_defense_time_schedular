import {RevisionTarget, ThesisFormInput, TimeSlotSelectionInput} from '../types';
import axios from 'axios';
import { API_BASE_URL } from './config';


const getApi = () => {
    const token = localStorage.getItem('auth-storage');
    const authData = token ? JSON.parse(token) : null;

    return axios.create({
        baseURL: `${API_BASE_URL}/student`,
        headers: {
            Authorization: `Bearer ${authData?.state?.token}`,
        },
    });
};

export const studentAPI = {
    createThesisForm: async (data: ThesisFormInput) => {
        const response = await getApi().post('/forms', data);
        return response.data;
    },

    getMyThesisForms: async () => {
        const response = await getApi().get('/forms');
        return response.data;
    },

    getMeetings: async () => {
        const response = await getApi().get('/meetings');
        return response.data;
    },

    getMeetingDetails: async (id: number) => {
        const response = await getApi().get(`/meetings/${id}`);
        return response.data;
    },

    chooseTimeSlot: async (data: TimeSlotSelectionInput) => {
        const response = await getApi().post('/meetings/time-slots', data);
        return response.data;
    },

    getAllProfessors: async () => {
        const response = await getApi().get('/professors');
        return response.data;
    },

    updatePhoneNumber: async (phone: string) => {
        const response = await getApi().put('/profile/update-phone', {phoneNumber: phone});
        return response.data;
    },

    getProfile: async () => {
        const response = await getApi().get("/profile");
        return response.data;
    },

    changePassword: async (data: { currentPassword: string; newPassword: string }) => {
        const response = await getApi().put('/profile/change-password', data);
        return response.data;
    },

    submitRevision: async (formId: number)=> {
        const response = await getApi().post(`/forms/${formId}/submit-revision`);
        return response.data;
    },

    editForm: async (formId: number, data: ThesisFormInput) => {
        const response = await getApi().put(`/forms/${formId}/update`, data);
        return response.data;
    }
};
