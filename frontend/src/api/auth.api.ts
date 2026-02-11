import axiosInstance from './axios.config';
import { LoginRequest, LoginResponse } from '../types';

export const authAPI = {
    login: async (credentials: LoginRequest): Promise<LoginResponse> => {
        const response = await axiosInstance.post('/auth/login', credentials);

        return {
            accessToken: response.data.accessToken,
            refreshToken: response.data.refreshToken,
            email: response.data.email,
            role: response.data.role,
            userId: response.data.userId,
            expiresIn: response.data.expiresIn
        };
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('userId');
    },

    getCurrentUser: async () => {
        const response = await axiosInstance.get('/auth/me');
        return response.data;
    }
};
