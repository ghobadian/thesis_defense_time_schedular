import axios from 'axios';
import { API_BASE_URL } from './config';
import {Student, StudentRegistration} from "../types";

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

export const adminAPI = {
    registerStudent: async (data: StudentRegistration) => {
        const response = await getAdminAPI().post('/register-student', data);
        return response.data;
    },

    registerStudents: async (data: StudentRegistration[]) => {
        const response = await getAdminAPI().post('/register-students', data);
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

    // New methods for Student Management
    getStudents: async (params?: {
        search?: string;
        department?: string;
        page?: number;
        limit?: number;
    }) => {
        const response = await getAdminAPI().get('/students', { params });
        return response.data;
    },

    getStudentById: async (studentId: string) => {
        const response = await getAdminAPI().get(`/students/${studentId}`);
        return response.data;
    },

    updateStudent: async (studentId: string, data: any) => {
        const response = await getAdminAPI().put(`/students/${studentId}`, data);
        return response.data;
    },

    deleteStudent: async (studentId: string) => {
        const response = await getAdminAPI().delete(`/students/${studentId}`);
        return response.data;
    },
};
