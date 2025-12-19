import axios from 'axios';
import { API_BASE_URL } from './config';
import {AvailableTime, MeetingTimeSlotsResponse} from "../types";



const getProfessorAPI = () => {
    const token = localStorage.getItem('auth-storage');
    const authData = token ? JSON.parse(token) : null;

    return axios.create({
        baseURL: `${API_BASE_URL}/professor`,
        headers: {
            Authorization: `Bearer ${authData?.state?.token}`,
        },
    });
};

export const professorAPI = {
    getPendingThesisForms: async () => {
        const response = await getProfessorAPI().get('/forms');
        return response.data;
    },

    approveThesisForm: async (formId: number) => {
        const response = await getProfessorAPI().post(`/forms/${formId}/approve`);
        return response.data;
    },

    rejectThesisForm: async (formId: number, rejectionReason: string) => {
        const response = await getProfessorAPI().post(`/forms/reject`, { formId: formId, rejectionReason: rejectionReason });
        return response.data;
    },

    getMyMeetings: async () => {
        const response = await getProfessorAPI().get('/meetings');
        return response.data;
    },

    getMeetingById: async (meetingId: number) => {
        const response = await getProfessorAPI().get('/meetings/' + meetingId);
        return response.data;
    },


    submitMeetingTimeSlots: async (requestBody: AvailableTime)=> {
        const response = await getProfessorAPI().post('/meetings/give-time', requestBody);
        return response.data;
    },

    getMyTimeslots: async() => {
        const response = await getProfessorAPI().get(`/timeslots`);
        return response.data;
    },


    createMeeting: async (formId: number, juryIds: number[], location: string) => {
        const response = await getProfessorAPI().post('/meetings/create', {
            formId,
            juryIds,
            location
        });
        return response.data;
    },

    cancelMeeting: async (meetingId: number) => {
        const response = await getProfessorAPI().post(`/meetings/${meetingId}/cancel`);
        return response.data;
    },

    scoreMeeting: async (data: { meetingId: number; score: number }) => {
        const response = await getProfessorAPI().post('/meetings/score', data);
        return response.data;
    },

    scheduleMeeting: async (data: { meetingId: number; location: string }) => {
        const response = await getProfessorAPI().post('/meetings/schedule', data);
        return response.data;
    },

    getMySupervisedStudents: async () => {
        const response = await getProfessorAPI().get('/students');
        return response.data;
    },


    getMeetingTimeSlots: async (meetingId: number): Promise<MeetingTimeSlotsResponse> => {
        const response = await getProfessorAPI().get(`/meetings/${meetingId}/timeslots`);
        return response.data;
    },

    getMyMeetingTimeSlots: async (meetingId: number) => {
        const response = await getProfessorAPI().get(`/meetings/${meetingId}/my-timeslots`);
        return response.data;
    },

    getAllProfessors: async () => {
        const response = await getProfessorAPI().get('/list');
        return response.data;
    },

    updatePhoneNumber: async (phone: string) => {
        const response = await getProfessorAPI().put('/update-phone', {phoneNumber: phone});
        return response.data;
    },

    getProfile: async () => {
        const response = await getProfessorAPI().get("/");
        return response.data;
    },

    changePassword: async (data: { currentPassword: string; newPassword: string }) => {
        const response = await getProfessorAPI().put('/change-password', data);
        return response.data;
    },



};
