import axios from 'axios';
import { API_BASE_URL } from './config';
import {AvailableTime, MeetingTimeSlotsResponse, RevisionTarget} from "../types";



const getApi = () => {
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
        const response = await getApi().get('/forms');
        return response.data;
    },

    approveThesisForm: async (formId: number) => {
        const response = await getApi().post(`/forms/${formId}/approve`);
        return response.data;
    },

    rejectThesisForm: async (formId: number, rejectionReason: string) => {
        const response = await getApi().post(`/forms/reject`, { formId: formId, rejectionReason: rejectionReason });
        return response.data;
    },

    getMyMeetings: async () => {
        const response = await getApi().get('/meetings');
        return response.data;
    },

    getMeetingById: async (meetingId: number) => {
        const response = await getApi().get('/meetings/' + meetingId);
        return response.data;
    },


    submitMeetingTimeSlots: async (requestBody: AvailableTime)=> {
        const response = await getApi().post('/meetings/give-time', requestBody);
        return response.data;
    },

    getMyTimeslots: async() => {
        const response = await getApi().get(`/timeslots`);
        return response.data;
    },


    createMeeting: async (formId: number, juryIds: number[], location: string) => {
        const response = await getApi().post('/meetings/create', {
            formId,
            juryIds,
            location
        });
        return response.data;
    },

    cancelMeeting: async (meetingId: number) => {
        const response = await getApi().post(`/meetings/${meetingId}/cancel`);
        return response.data;
    },

    scoreMeeting: async (data: { meetingId: number; score: number }) => {
        const response = await getApi().post('/meetings/score', data);
        return response.data;
    },

    scheduleMeeting: async (data: { meetingId: number; location: string }) => {
        const response = await getApi().post('/meetings/schedule', data);
        return response.data;
    },

    getMySupervisedStudents: async () => {
        const response = await getApi().get('/students');
        return response.data;
    },


    getMeetingTimeSlots: async (meetingId: number): Promise<MeetingTimeSlotsResponse> => {
        const response = await getApi().get(`/meetings/${meetingId}/timeslots`);
        return response.data;
    },

    getMyMeetingTimeSlots: async (meetingId: number) => {
        const response = await getApi().get(`/meetings/${meetingId}/my-timeslots`);
        return response.data;
    },

    getAllProfessors: async () => {
        const response = await getApi().get('/list');
        return response.data;
    },

    updatePhoneNumber: async (phone: string) => {
        const response = await getApi().put('/update-phone', {phoneNumber: phone});
        return response.data;
    },

    getProfile: async () => {
        const response = await getApi().get("/");
        return response.data;
    },

    changePassword: async (data: { currentPassword: string; newPassword: string }) => {
        const response = await getApi().put('/change-password', data);
        return response.data;
    },

    requestRevision: async (id: number, target: RevisionTarget, message: string)=> {
        const response = await getApi().post('/forms/request-revision', {id, target, message});
        return response.data;
    },

    submitRevision: async (formId: number)=> {
        const response = await getApi().post(`/forms/${formId}/submit-revision`);
        return response.data;
    },
};
