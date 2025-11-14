import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { authAPI } from '../../api/auth.api';
import { Button } from '../common/Button';

export const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const { clearAuth, role, firstName, lastName } = useAuthStore();

    const handleLogout = () => {
        authAPI.logout();
        clearAuth();
        navigate('/login');
    };

    const getRoleName = () => {
        switch (role) {
            case 'ADMIN':
                return 'Admin';
            case 'PROFESSOR':
                return 'Professor';
            case 'MANAGER':
                return 'Manager';
            case 'STUDENT':
                return 'Student';
            default:
                return 'User';
        }
    };

    const getFullName = () => {
        if (firstName && lastName) {
            return `${firstName} ${lastName}`;
        }
        return firstName || lastName || '';
    };

    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <h1 className="text-xl font-bold text-primary-600">
                            Thesis Defense Scheduler
                        </h1>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2 text-gray-700">
                            <User className="h-5 w-5" />
                            <div className="flex flex-col">
                                <span className="font-medium">{getRoleName()}</span>
                                {getFullName() && (
                                    <span className="text-sm text-gray-500">{getFullName()}</span>
                                )}
                            </div>
                        </div>

                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={handleLogout}
                            className="flex items-center space-x-2"
                        >
                            <LogOut className="h-4 w-4" />
                            <span>Logout</span>
                        </Button>
                    </div>
                </div>
            </div>
        </nav>
    );
};
