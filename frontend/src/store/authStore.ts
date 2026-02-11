import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserRole } from '../types';

interface AuthState {
    token: string | null;
    role: UserRole | null;
    userId: number | null;
    firstName: string | null;
    lastName: string | null;
    setAuth: (token: string, role: UserRole, userId: number) => void;
    clearAuth: () => void;
    isAuthenticated: () => boolean;
}

// Helper function to decode JWT
const decodeJWT = (token: string) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Error decoding JWT:', error);
        return null;
    }
};

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            token: null,
            role: null,
            userId: null,
            firstName: null,
            lastName: null,
            setAuth: (token, role, userId) => {
                // Decode the JWT to extract firstName and lastName
                const decoded = decodeJWT(token);
                const firstName = decoded?.firstName || null;
                const lastName = decoded?.lastName || null;

                set({ token, role, userId, firstName, lastName });
            },
            clearAuth: () => set({
                token: null,
                role: null,
                userId: null,
                firstName: null,
                lastName: null
            }),
            isAuthenticated: () => !!get().token,
        }),
        {
            name: 'auth-storage',
        }
    )
);
