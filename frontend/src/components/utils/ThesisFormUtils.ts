// src/utils/thesisFormUtils.ts

import { FormState } from '../../types';

export const formatDate = (dateString: string): string =>
    new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

export const getFullName = (firstName?: string, lastName?: string): string =>
    firstName && lastName ? `${firstName} ${lastName}` : firstName || lastName || 'N/A';

export const getStatusBadgeClass = (state: FormState): string => {
    switch (state) {
        case FormState.SUBMITTED:
            return 'submitted';
        case FormState.INSTRUCTOR_APPROVED:
            return 'instructor-approved';
        case FormState.INSTRUCTOR_REJECTED:
            return 'instructor-rejected';
        case FormState.ADMIN_APPROVED:
            return 'admin-approved';
        case FormState.ADMIN_REJECTED:
            return 'admin-rejected';
        case FormState.MANAGER_APPROVED:
            return 'manager-approved';
        case FormState.MANAGER_REJECTED:
            return 'manager-rejected';
        default:
            return 'submitted';
    }
};

export const getStatusLabel = (state: FormState): string => {
    switch (state) {
        case FormState.SUBMITTED:
            return 'Pending Review';
        case FormState.INSTRUCTOR_APPROVED:
            return 'Instructor Approved';
        case FormState.INSTRUCTOR_REJECTED:
            return 'Instructor Rejected';
        case FormState.ADMIN_APPROVED:
            return 'Admin Approved';
        case FormState.ADMIN_REJECTED:
            return 'Admin Rejected';
        case FormState.MANAGER_APPROVED:
            return 'Manager Approved';
        case FormState.MANAGER_REJECTED:
            return 'Manager Rejected';
        default:
            return String(state);
    }
};
