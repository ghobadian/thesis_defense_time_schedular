import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Globe } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { authAPI } from '../../api/auth.api';
import { Button } from '../common/Button';
import { useTranslation } from 'react-i18next';

export const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const { clearAuth, role, firstName, lastName } = useAuthStore();
    const { t, i18n } = useTranslation("common");

    const isRTL = i18n.language === 'fa';

    // ✅ FIX 1: Sync document direction immediately on load and when language changes
    useEffect(() => {
        document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
        document.documentElement.lang = i18n.language;
        localStorage.setItem('language', i18n.language);
    }, [isRTL, i18n.language]);

    const handleLogout = () => {
        authAPI.logout();
        clearAuth();
        navigate('/login');
    };

    const toggleLanguage = () => {
        const newLang = i18n.language === 'fa' ? 'en' : 'fa';
        i18n.changeLanguage(newLang);
    };

    const getRoleName = () => {
        switch (role) {
            case 'ADMIN':
                return t('admin');
            case 'PROFESSOR':
                return t('professor');
            case 'MANAGER':
                return t('manager');
            case 'STUDENT':
                return t('student_');
            default:
                return t('user');
        }
    };

    const getFullName = () => {
        if (firstName && lastName) {
            return `${firstName} ${lastName}`;
        }
        return firstName || lastName || '';
    };

    return (
        // ✅ FIX 2: Removed 'dir="ltr"'.
        // This allows the navbar to inherit 'rtl' from the document body,
        // causing the Flexbox to naturally flip (Title on Right, Controls on Left) for Persian.
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">

                    {/* ===== Title Section ===== */}
                    <div className="flex items-center">
                        <h1
                            className="text-xl font-bold text-primary-600"
                            // Keep specific text direction if needed, or remove to inherit
                            dir={isRTL ? 'rtl' : 'ltr'}
                        >
                            {t('navbar-title')}
                        </h1>
                    </div>

                    {/* ===== Controls Section ===== */}
                    <div className="flex items-center gap-3">

                        {/* --- Language Switch --- */}
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={toggleLanguage}
                            className="flex items-center gap-2 min-w-[110px] justify-center"
                            // ⬆️ min-w prevents width change between languages
                        >
                            <Globe className="h-4 w-4 flex-shrink-0"/>
                            <span className="flex-shrink-0">
                                {isRTL ? 'پارسی' : 'English'}
                            </span>
                        </Button>

                        {/* --- Separator --- */}
                        <div className="h-8 w-px bg-gray-300"/>

                        {/* --- User Info (always same position) --- */}
                        <div
                            className="flex items-center gap-2 text-gray-700"
                            dir={isRTL ? 'rtl' : 'ltr'}
                            // ⬆️ Only the text content respects RTL, not its position
                        >
                            <User className="h-5 w-5 flex-shrink-0"/>
                            <div className="flex flex-col">
                                <span className="font-medium text-sm">{getRoleName()}</span>
                                {getFullName() && (
                                    <span className="text-xs text-gray-500">{getFullName()}</span>
                                )}
                            </div>
                        </div>

                        {/* --- Separator --- */}
                        <div className="h-8 w-px bg-gray-300"/>

                        {/* --- Logout Button (always same position) --- */}
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={handleLogout}
                            className="flex items-center gap-2"
                        >
                            <LogOut className="h-4 w-4 flex-shrink-0"/>
                            <span>{t('logout')}</span>
                        </Button>
                    </div>
                </div>
            </div>
        </nav>
    );
};
