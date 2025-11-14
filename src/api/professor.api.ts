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
        const response = await getProfessorAPI().post(`/approve-form/${formId}`);
        return response.data;
    },

    rejectThesisForm: async (formId: number, reason: string) => {
        const response = await getProfessorAPI().post(`/reject-form/${formId}`, { reason });
        return response.data;
    },

    submitTimeSlots: async (data: { date: string; periods: string[] }) => {
        const response = await getProfessorAPI().post('/give-time', data);
        return response.data;
    },

    getMyTimeSlots: async () => {
        const response = await getProfessorAPI().get('/timeslots');
        return response.data;
    },

    getMeetings: async () => {
        const response = await getProfessorAPI().get('/meetings');
        return response.data;
    },

    getMySupervisedStudents: async () => {
        const response = await getProfessorAPI().get('/students');
        return response.data;
    },
    getMeetingById: async (meetingId: number) => {
        const response = await getProfessorAPI().get('/meetings/' + meetingId);
        return response.data;
    },
    submitMeetingTimeSlots: async (requestBody: AvailableTime)=> {
        const response = await getProfessorAPI().post('/give-time', requestBody);
        return response.data;
    },
    getMeetingTimeSlots: async (meetingId: number): Promise<MeetingTimeSlotsResponse> => {
        const response = await getProfessorAPI().get(`/meetings/${meetingId}/timeslots`);
        return response.data;
    },
    getMyMeetingTimeSlots: async (meetingId: number) => {
        const response = await getProfessorAPI().get(`/meetings/${meetingId}/my-timeslots`);
        return response.data;
    }
};
