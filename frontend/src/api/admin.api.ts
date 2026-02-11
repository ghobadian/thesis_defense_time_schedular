import axios from 'axios';
import { API_BASE_URL } from './config';
import {Meeting, ProfessorRegistrationInput, ProfessorSearch, RevisionTarget, StudentUpdateRequest} from "../types";

const getApi = () => {
    const token = localStorage.getItem('auth-storage');
    const authData = token ? JSON.parse(token) : null;

    return axios.create({
        baseURL: `${API_BASE_URL}/admin`,
        headers: {
            Authorization: `Bearer ${authData?.state?.token}`,
        },
    });
};


interface StudentSearch {
    search?: string;
    departmentId?: number;
    page?: number;
    limit?: number;
    studentType?: string;
}

export const adminAPI = {


    getAllProfessors: async () => {
        const response = await getApi().get('/professors/all');
        return response.data;
    },

    registerProfessor: async (data: ProfessorRegistrationInput[]) => {
        const response = await getApi().post('/professors', data);
        return response.data;
    },

    getProfessors: async (params: ProfessorSearch) => {
        const response = await getApi().get('/professors', { params });
        return response.data;
    },

    getProfessorById: async (id: number) => {
        const response = await getApi().get(`/professors/${id}`);
        return response.data;
    },

    updateProfessor: async (id: number, data: Omit<ProfessorRegistrationInput, 'password'>) => {
        const response = await getApi().put(`/professors/${id}`, data);
        return response.data;
    },

    deleteProfessor: async (id: number) => {
        const response = await getApi().delete(`/professors/${id}`);
        return response.data;
    },

    getForms: async () => {
        const response = await getApi().get('/forms');
        return response.data;
    },

    approveForm: async (formId: number) => {
        const response = await getApi().post(`/forms/${formId}/approve`);
        return response.data;
    },

    rejectForm: async (formId: number, rejectionReason: string) => {
        const response = await getApi().post(`/forms/reject`, {
            formId: formId,
            rejectionReason: rejectionReason
        });
        return response.data;
    },

    getAllDepartments: async () => {
        const response = await getApi().get('/departments');
        return response.data;
    },

    getAllFields: async () => {
        const response = await getApi().get('/fields');
        return response.data;
    },

    getStats: async () => {
        const response = await getApi().get('/stats');
        return response.data;
    },

    getRecentActivities: async () => {
        const response = await getApi().get('/activities/recent');
        return response.data;
    },

    getDepartments: async () => {
        const response = await getApi().get('/departments');
        return response.data;
    },

    registerStudent: async (data: StudentUpdateRequest[]) => {
        const response = await getApi().post('/students', data);
        return response.data;
    },

    getStudents: async (params: StudentSearch) => {
        const response = await getApi().get('/students', {params});
        return response.data;
    },

    getStudentById: async (studentId: number) => {
        const response = await getApi().get(`/students/${studentId}`);
        return response.data;
    },

    updateStudent: async (studentId: number, data: StudentUpdateRequest) => {
        const response = await getApi().put(`/students/${studentId}`, data);
        return response.data;
    },

    deleteStudent: async (studentId: number) => {
        const response = await getApi().delete(`/students/${studentId}`);
        return response.data;
    },

    getAllMeetings: async (): Promise<Meeting[]> => {
        const response = await getApi().get('/meetings');
        return response.data;
    },

    getMeetingDetails: async (id: string): Promise<Meeting> => {
        const response = await getApi().get(`/meetings/${id}`);
        return response.data;
    },

    createDepartment: async (data: { name: string }) => {
        const response = await getApi().post('/departments', data);
        return response.data;
    },

    updateDepartment: async (id: number, data: { name: string }) => {
        const response = await getApi().put(`/departments/${id}`, data);
        return response.data;
    },

    deleteDepartment: async (id: number) => {
        const response = await getApi().delete(`/departments/${id}`);
        return response.data;
    },

    updateField: async(fieldId: number, field: { name: string; departmentId: number })=> {
        const response = await getApi().put(`/fields/${fieldId}`, field);
        return response.data;
    },

    createField: async(field: { name: string; departmentId: number })=> {
        const response = await getApi().post(`/fields`, field);
        return response.data;
    },

    deleteField: async(fieldId: number)=> {
        const response = await getApi().delete(`/fields/${fieldId}`);
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
