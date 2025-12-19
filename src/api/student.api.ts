import { ThesisFormInput, TimeSlotSelectionInput } from '../types';
import axios from 'axios';
import { API_BASE_URL } from './config';


const getStudentAPI = () => {
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
        const response = await getStudentAPI().post('/create-form', data);
        return response.data;
    },

    getMyThesisForms: async () => {
        const response = await getStudentAPI().get('/forms');
        return response.data;
    },

    getMeetings: async () => {
        const response = await getStudentAPI().get('/meetings');
        return response.data;
    },

    getMeetingDetails: async (id: number) => {
        const response = await getStudentAPI().get(`/meetings/${id}`);
        return response.data;
    },

    chooseTimeSlot: async (data: TimeSlotSelectionInput) => {
        const response = await getStudentAPI().post('/time-slots', data);
        return response.data;
    },



    getAllProfessors: async () => {
        const response = await getStudentAPI().get('/professors');
        return response.data;
    },

    updatePhoneNumber: async (phone: string) => {
        const response = await getStudentAPI().put('/update-phone', {phoneNumber: phone});
        return response.data;
    },

    getProfile: async () => {
        const response = await getStudentAPI().get("/");
        return response.data;
    },

    changePassword: async (data: { currentPassword: string; newPassword: string }) => {
        const response = await getStudentAPI().put('/change-password', data);
        return response.data;
    },
};
