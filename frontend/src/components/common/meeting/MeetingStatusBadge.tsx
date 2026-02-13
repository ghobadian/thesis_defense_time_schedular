// src/components/common/meeting/MeetingStatusBadge.tsx
import React from 'react';
import { MeetingState } from '../../../types';
import { getStatusColor, getStatusLabel } from './meetingUtils';

interface MeetingStatusBadgeProps {
    state: MeetingState;
    userRole: 'professor' | 'student';
}

export const MeetingStatusBadge: React.FC<MeetingStatusBadgeProps> = ({ state, userRole }) => (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(state)}`}>
        {getStatusLabel(state, userRole)}
    </span>
);
