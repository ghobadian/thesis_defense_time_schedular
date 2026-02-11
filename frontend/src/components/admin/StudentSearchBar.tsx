// src/components/admin/students/StudentSearchBar.tsx
import React from 'react';
import { Search } from 'lucide-react';

interface StudentSearchBarProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export const StudentSearchBar: React.FC<StudentSearchBarProps> = ({
                                                                      value,
                                                                      onChange,
                                                                      placeholder = "Search by name, email, or student ID..."
                                                                  }) => {
    return (
        <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
                type="text"
                placeholder={placeholder}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
};
