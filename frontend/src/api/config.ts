export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';
export const JURY_SELECTION_CONFIG = {
    MIN_JURY_MEMBERS: Number(import.meta.env.VITE_MIN_JURY_MEMBERS) || 4,
    MAX_JURY_MEMBERS: Number(import.meta.env.VITE_MAX_JURY_MEMBERS) || 10,
};
