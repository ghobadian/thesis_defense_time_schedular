import React from 'react';
import {NavLink} from 'react-router-dom';
import {
    Home,
    FileText,
    Calendar,
    Users,
    Building2,
    ClipboardList,
    Settings,
    BarChart3
} from 'lucide-react';
import {useAuthStore} from '../../store/authStore';
import {UserRole} from '../../types';
import {useTranslation} from "react-i18next";

export const Sidebar: React.FC = () => {
    const {role} = useAuthStore();

    const {t} = useTranslation(["common", "professor", "admin", "student"]);
    const getNavigationItems = () => {
        switch (role) {
            case UserRole.ADMIN:
                return [
                    {to: '/admin/dashboard', icon: Home, label: t('dashboard')},
                    {to: '/admin/students', icon: Users, label: t('admin:students-management')},
                    {to: '/admin/professors', icon: Users, label: t('admin:professors-management')},
                    {to: '/admin/departments', icon: Building2, label: t('admin:departments-management')},
                    {to: '/admin/fields', icon: ClipboardList, label: t('admin:fields-management')},
                    {to: '/admin/thesis-forms', icon: FileText, label: t('admin:thesis-forms')},
                    {to: '/admin/meetings', icon: Calendar, label: t('meetings')},
                    {to: '/admin/profile', icon: Settings, label: t('profile')},
                ];

            case UserRole.PROFESSOR:
            case UserRole.MANAGER:
                return [
                    {to: '/professor/dashboard', icon: Home, label: t('dashboard')},
                    {to: '/professor/thesis-forms', icon: FileText, label: t('thesis-forms')},
                    {to: '/professor/meetings', icon: Calendar, label: t('meetings')},
                    {to: '/professor/students', icon: Users, label: t('professor:my-students')},
                    {to: '/professor/profile', icon: Settings, label: t('profile')},
                ];

            case UserRole.STUDENT:
                return [
                    {to: '/student/dashboard', icon: Home, label: t('dashboard')},
                    {to: '/student/thesis-form', icon: FileText, label: t('thesis-forms')},
                    {to: '/student/meetings', icon: Calendar, label: t('meetings')},
                    {to: '/student/profile', icon: Settings, label: t('profile')},
                ];

            default:
                return [];
        }
    };

    const navItems = getNavigationItems();

    return (
        <aside className="bg-gray-800 text-white w-64 min-h-screen p-4">
            <nav className="space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({isActive}) =>
                            `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                                isActive
                                    ? 'bg-primary-600 text-white'
                                    : 'text-gray-300 hover:bg-gray-700'
                            }`
                        }
                    >
                        <item.icon className="h-5 w-5"/>
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
};
