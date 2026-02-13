export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api/v1';
export const JURY_SELECTION_CONFIG = {
    MIN_JURY_MEMBERS: Number(process.env.REACT_APP_MIN_JURY_MEMBERS) || 4,
    MAX_JURY_MEMBERS: Number(process.env.REACT_APP_MAX_JURY_MEMBERS) || 10,
};