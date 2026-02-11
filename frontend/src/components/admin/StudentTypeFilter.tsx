// src/components/admin/StudentTypeFilter.tsx
import React from 'react';
import { StudentType } from "../../types";

interface StudentTypeFilterProps {
    value: string;
    onChange: (value: string) => void;
}

export const StudentTypeFilter: React.FC<StudentTypeFilterProps> = ({
                                                                        value,
                                                                        onChange
                                                                    }) => {
    return (
        <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={value}
            onChange={(e) => onChange(e.target.value)}
        >
            <option value="">All Student Types</option>
            <option value={StudentType.BACHELOR}>Bachelor</option>
            <option value={StudentType.MASTER}>Master</option>
            <option value={StudentType.PHD}>PhD</option>
        </select>
    );
};
