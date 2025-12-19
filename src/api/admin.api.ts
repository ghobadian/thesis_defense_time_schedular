import axios from 'axios';
import { API_BASE_URL } from './config';
import {Meeting, StudentUpdateRequest} from "../types";

const getAdminAPI = () => {
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
    registerStudent: async (data: StudentUpdateRequest[]) => {
        const response = await getAdminAPI().post('/students', data);
        return response.data;
    },

    getAllProfessors: async () => {
        const response = await getAdminAPI().get('/professors');
        return response.data;
    },

    getForms: async () => {
        const response = await getAdminAPI().get('/forms');
        return response.data;
    },

    approveForm: async (formId: number) => {
        const response = await getAdminAPI().post(`/forms/${formId}/approve`);
        return response.data;
    },

    rejectForm: async (formId: number) => {
        const response = await getAdminAPI().post(`/forms/${formId}/reject`);
        return response.data;
    },

    getAllDepartments: async () => {
        const response = await getAdminAPI().get('/departments');
        return response.data;
    },

    getAllFields: async () => {
        const response = await getAdminAPI().get('/fields');
        return response.data;
    },

    getStats: async () => {
        const response = await getAdminAPI().get('/stats');
        return response.data;
    },

    getRecentActivities: async () => {
        const response = await getAdminAPI().get('/activities/recent');
        return response.data;
    },

    getDepartments: async () => {
        const response = await getAdminAPI().get('/departments');
        return response.data;
    },



    getStudents: async (params: StudentSearch) => {
        const response = await getAdminAPI().get('/students', {params});
        return response.data;
    },

    getStudentById: async (studentId: number) => {
        const response = await getAdminAPI().get(`/students/${studentId}`);
        return response.data;
    },

    updateStudent: async (studentId: number, data: StudentUpdateRequest) => {
        const response = await getAdminAPI().put(`/students/${studentId}`, data);
        return response.data;
    },

    deleteStudent: async (studentId: number) => {
        const response = await getAdminAPI().delete(`/students/${studentId}`);
        return response.data;
    },

    getAllMeetings: async (): Promise<Meeting[]> => {
        const response = await getAdminAPI().get('/meetings');
        return response.data;
    },

    getMeetingDetails: async (id: string): Promise<Meeting> => {
        const response = await getAdminAPI().get(`/meetings/${id}`);
        return response.data;
    },

    createDepartment: async (data: { name: string }) => {
        const response = await getAdminAPI().post('/departments', data);
        return response.data;
    },

    updateDepartment: async (id: number, data: { name: string }) => {
        const response = await getAdminAPI().put(`/departments/${id}`, data);
        return response.data;
    },

    deleteDepartment: async (id: number) => {
        const response = await getAdminAPI().delete(`/departments/${id}`);
        return response.data;
    },

    updateField: async(fieldId: number, field: { name: string; departmentId: number })=> {
        const response = await getAdminAPI().put(`/fields/${fieldId}`, field);
        return response.data;
    },

    createField: async(field: { name: string; departmentId: number })=> {
        const response = await getAdminAPI().post(`/fields`, field);
        return response.data;
    },

    deleteField: async(fieldId: number)=> {
        const response = await getAdminAPI().delete(`/fields/${fieldId}`);
        return response.data;
    },

    updatePhoneNumber: async (phone: string) => {
        const response = await getAdminAPI().put('/update-phone', {phoneNumber: phone});
        return response.data;
    },

    getProfile: async () => {
        const response = await getAdminAPI().get("/");
        return response.data;
    },

    changePassword: async (data: { currentPassword: string; newPassword: string }) => {
        const response = await getAdminAPI().put('/change-password', data);
        return response.data;
    },
};
