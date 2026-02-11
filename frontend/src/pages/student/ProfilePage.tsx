// src/pages/common/ProfilePage.tsx

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { useAuthStore } from '../../store/authStore';
import { studentAPI } from '../../api/student.api';
import { professorAPI } from '../../api/professor.api';
import { adminAPI } from '../../api/admin.api';
import { UserRole } from '../../types';
import {
    User,
    Mail,
    Phone,
    Building2,
    BookOpen,
    GraduationCap,
    Shield,
    Key,
    Save,
    X,
    CheckCircle,
    AlertCircle,
    UserCog,
    Edit3,
    Lock
} from 'lucide-react';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface BaseProfile {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
}

interface StudentProfile extends BaseProfile {
    studentNumber: string;
    studentType: 'PHD' | 'MASTER' | 'BACHELOR';
    department?: { id: number; name: string };
    field?: { id: number; name: string };
    instructor?: { id: number; firstName: string; lastName: string };
    isGraduated: boolean;
}

interface ProfessorProfile extends BaseProfile {
    department?: { id: number; name: string };
    isManager: boolean;
}

interface AdminProfile extends BaseProfile {
    role: 'ADMIN';
}

type UserProfile = StudentProfile | ProfessorProfile | AdminProfile;

interface PasswordChangeData {
    currentPassword: string;
    newPassword: string;
}

// ============================================================================
// API CONFIGURATION BY ROLE
// ============================================================================

const getAPIByRole = (role: UserRole) => {
    switch (role) {
        case UserRole.STUDENT:
            return {
                getProfile: studentAPI.getProfile,
                updatePhoneNumber: studentAPI.updatePhoneNumber,
                changePassword: studentAPI.changePassword,
            };
        case UserRole.PROFESSOR:
        case UserRole.MANAGER:
            return {
                getProfile: professorAPI.getProfile,
                updatePhoneNumber: professorAPI.updatePhoneNumber,
                changePassword: professorAPI.changePassword,
            };
        case UserRole.ADMIN:
            return {
                getProfile: adminAPI.getProfile,
                updatePhoneNumber: adminAPI.updatePhoneNumber,
                changePassword: adminAPI.changePassword,
            };
        default:
            throw new Error(`Unknown role: ${role}`);
    }
};

const getQueryKey = (role: UserRole): string[] => {
    switch (role) {
        case UserRole.STUDENT:
            return ['studentProfile'];
        case UserRole.PROFESSOR:
        case UserRole.MANAGER:
            return ['professorProfile'];
        case UserRole.ADMIN:
            return ['adminProfile'];
        default:
            return ['profile'];
    }
};

// ============================================================================
// ROLE DISPLAY CONFIGURATION
// ============================================================================

interface RoleConfig {
    title: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    bgColor: string;
}

const getRoleConfig = (role: UserRole): RoleConfig => {
    switch (role) {
        case UserRole.STUDENT:
            return {
                title: 'Student Profile',
                icon: GraduationCap,
                color: 'text-blue-600',
                bgColor: 'bg-blue-100',
            };
        case UserRole.PROFESSOR:
            return {
                title: 'Professor Profile',
                icon: BookOpen,
                color: 'text-green-600',
                bgColor: 'bg-green-100',
            };
        case UserRole.MANAGER:
            return {
                title: 'Department Manager Profile',
                icon: Building2,
                color: 'text-purple-600',
                bgColor: 'bg-purple-100',
            };
        case UserRole.ADMIN:
            return {
                title: 'Administrator Profile',
                icon: Shield,
                color: 'text-red-600',
                bgColor: 'bg-red-100',
            };
        default:
            return {
                title: 'Profile',
                icon: User,
                color: 'text-gray-600',
                bgColor: 'bg-gray-100',
            };
    }
};

// ============================================================================
// TYPE GUARDS
// ============================================================================

const isStudentProfile = (profile: UserProfile, role: UserRole): profile is StudentProfile => {
    return role === UserRole.STUDENT && 'studentNumber' in profile;
};

const isProfessorProfile = (profile: UserProfile, role: UserRole): profile is ProfessorProfile => {
    return (role === UserRole.PROFESSOR || role === UserRole.MANAGER) && 'isManager' in profile;
};

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

interface InfoFieldProps {
    label: string;
    value: string | React.ReactNode;
    icon?: React.ComponentType<{ className?: string }>;
}

const InfoField: React.FC<InfoFieldProps> = ({ label, value, icon: Icon }) => (
    <div>
        <label className="block text-sm font-medium text-gray-500 mb-1">
            {Icon && <Icon className="inline h-4 w-4 mr-1" />}
            {label}
        </label>
        {typeof value === 'string' ? (
            <p className="text-gray-900 font-medium">{value || '-'}</p>
        ) : (
            value
        )}
    </div>
);

interface BadgeProps {
    children: React.ReactNode;
    variant: 'blue' | 'green' | 'purple' | 'red' | 'yellow' | 'gray';
}

const Badge: React.FC<BadgeProps> = ({ children, variant }) => {
    const variantClasses: Record<string, string> = {
        blue: 'bg-blue-100 text-blue-800',
        green: 'bg-green-100 text-green-800',
        purple: 'bg-purple-100 text-purple-800',
        red: 'bg-red-100 text-red-800',
        yellow: 'bg-yellow-100 text-yellow-800',
        gray: 'bg-gray-100 text-gray-800',
    };

    return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${variantClasses[variant]}`}>
            {children}
        </span>
    );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const ProfilePage: React.FC = () => {
    const { role } = useAuthStore();
    const queryClient = useQueryClient();

    // State
    const [isEditingPhone, setIsEditingPhone] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Role Configuration
    const roleConfig = getRoleConfig(role!);
    const api = getAPIByRole(role!);
    const queryKey = getQueryKey(role!);
    const RoleIcon = roleConfig.icon;

    // Query: Fetch Profile
    const {
        data: profile,
        isLoading,
        error: fetchError,
        refetch
    } = useQuery<UserProfile>({
        queryKey,
        queryFn: api.getProfile,
        enabled: !!role,
        staleTime: 5 * 60 * 1000,
    });

    // Sync phone number when profile loads
    useEffect(() => {
        if (profile?.phoneNumber) {
            setPhoneNumber(profile.phoneNumber);
        }
    }, [profile]);

    // Auto-dismiss success message
    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => setSuccessMessage(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    // Mutation: Phone Update
    const updatePhoneMutation = useMutation({
        mutationFn: (phone: string) => api.updatePhoneNumber(phone),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
            setIsEditingPhone(false);
            setSuccessMessage('Phone number updated successfully!');
            setErrors({});
        },
        onError: (error: any) => {
            let errorMessage = 'Failed to update phone number';
            if (error?.response?.data) {
                const data = error.response.data;
                if (typeof data === 'string') {
                    errorMessage = data;
                } else if (data.message) {
                    errorMessage = data.message;
                } else if (data.phoneNumber) {
                    errorMessage = data.phoneNumber;
                } else if (data.error) {
                    errorMessage = data.error;
                }
            }
            setErrors({ phone: errorMessage });
        },
    });

    // Mutation: Password Change
    const updatePasswordMutation = useMutation({
        mutationFn: (data: PasswordChangeData) => api.changePassword(data),
        onSuccess: () => {
            setIsChangingPassword(false);
            setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setSuccessMessage('Password changed successfully!');
            setErrors({});
        },
        onError: (error: any) => {
            let errorMessage = 'Failed to update password. Please check your current password.';
            if (error?.response?.data) {
                const data = error.response.data;
                if (typeof data === 'string') {
                    errorMessage = data;
                } else if (data.message) {
                    errorMessage = data.message;
                }
            }
            setErrors({ password: errorMessage });
        },
    });

    // Form Handlers
    const handlePhoneSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        const trimmedPhone = phoneNumber.trim();
        if (!trimmedPhone) {
            setErrors({ phone: 'Phone number is required' });
            return;
        }
        updatePhoneMutation.mutate(trimmedPhone);
    };

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        const { currentPassword, newPassword, confirmPassword } = passwords;
        const newErrors: Record<string, string> = {};

        if (!currentPassword) newErrors.currentPassword = 'Current password is required';
        if (!newPassword) newErrors.newPassword = 'New password is required';
        else if (newPassword.length < 8) newErrors.newPassword = 'Password must be at least 8 characters';
        if (!confirmPassword) newErrors.confirmPassword = 'Please confirm your new password';
        else if (newPassword !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        updatePasswordMutation.mutate({ currentPassword, newPassword });
    };

    const cancelPhoneEdit = () => {
        setIsEditingPhone(false);
        setErrors({});
        setPhoneNumber(profile?.phoneNumber || '');
    };

    const cancelPasswordChange = () => {
        setIsChangingPassword(false);
        setErrors({});
        setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    };

    // Loading State
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                <p className="text-gray-500">Loading profile...</p>
            </div>
        );
    }

    // Error State
    if (fetchError || !profile) {
        return (
            <div className="max-w-2xl mx-auto">
                <Card>
                    <div className="p-6 text-center">
                        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Failed to Load Profile</h2>
                        <p className="text-gray-600 mb-4">We couldn't load your profile information.</p>
                        <Button onClick={() => refetch()}>Try Again</Button>
                    </div>
                </Card>
            </div>
        );
    }

    // Main Render
    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-8">
            {/* Header */}
            <div className="flex items-center space-x-4">
                <div className={`p-4 rounded-full ${roleConfig.bgColor}`}>
                    <RoleIcon className={`h-8 w-8 ${roleConfig.color}`} />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">{roleConfig.title}</h1>
                    <p className="text-gray-500 mt-1">Manage your account settings</p>
                </div>
            </div>

            {/* Success Message */}
            {successMessage && (
                <div className="flex items-center p-4 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    <p className="text-green-800 font-medium">{successMessage}</p>
                    <button onClick={() => setSuccessMessage(null)} className="ml-auto text-green-600 hover:text-green-800">
                        <X className="h-5 w-5" />
                    </button>
                </div>
            )}

            {/* Personal Information Card */}
            <Card>
                <div className="p-6">
                    <div className="flex items-center mb-6 pb-4 border-b">
                        <User className="h-5 w-5 text-gray-600 mr-2" />
                        <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InfoField label="First Name" value={profile.firstName} />
                        <InfoField label="Last Name" value={profile.lastName} />
                        <div className="md:col-span-2">
                            <InfoField label="Email Address" value={profile.email} icon={Mail} />
                        </div>

                        {/* Student Fields */}
                        {isStudentProfile(profile, role!) && (
                            <>
                                <InfoField label="Student Number" value={profile.studentNumber} />
                                <InfoField
                                    label="Student Type"
                                    value={
                                        <Badge variant={profile.studentType === 'PHD' ? 'purple' : profile.studentType === 'MASTER' ? 'blue' : 'green'}>
                                            {profile.studentType}
                                        </Badge>
                                    }
                                />
                                <InfoField label="Department" value={profile.department?.name || 'Not assigned'} icon={Building2} />
                                <InfoField label="Field of Study" value={profile.field?.name || 'Not assigned'} icon={BookOpen} />
                                <div className="md:col-span-2">
                                    <InfoField
                                        label="Thesis Instructor"
                                        value={profile.instructor ? `${profile.instructor.firstName} ${profile.instructor.lastName}` : 'Not assigned'}
                                        icon={UserCog}
                                    />
                                </div>
                                <InfoField
                                    label="Graduation Status"
                                    value={
                                        <Badge variant={profile.isGraduated ? 'green' : 'yellow'}>
                                            {profile.isGraduated ? '✓ Graduated' : '◷ Active Student'}
                                        </Badge>
                                    }
                                />
                            </>
                        )}

                        {/* Professor/Manager Fields */}
                        {isProfessorProfile(profile, role!) && (
                            <>
                                <InfoField label="Department" value={profile.department?.name || 'Not assigned'} icon={Building2} />
                                <InfoField
                                    label="Role"
                                    value={
                                        <Badge variant={profile.isManager ? 'purple' : 'green'}>
                                            {profile.isManager ? 'Department Manager' : 'Professor'}
                                        </Badge>
                                    }
                                />
                            </>
                        )}

                        {/* Admin Fields */}
                        {role === UserRole.ADMIN && (
                            <div className="md:col-span-2">
                                <InfoField
                                    label="Role"
                                    value={
                                        <Badge variant="red">
                                            <Shield className="h-3 w-3 mr-1" />
                                            System Administrator
                                        </Badge>
                                    }
                                />
                            </div>
                        )}
                    </div>

                    <div className="mt-6 pt-4 border-t">
                        <p className="text-sm text-gray-500 flex items-start">
                            <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                            Personal information can only be modified by a system administrator.
                        </p>
                    </div>
                </div>
            </Card>

            {/* Phone Number Card */}
            <Card>
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6 pb-4 border-b">
                        <div className="flex items-center">
                            <Phone className="h-5 w-5 text-gray-600 mr-2" />
                            <h2 className="text-xl font-semibold text-gray-900">Phone Number</h2>
                        </div>
                        {!isEditingPhone && (
                            <Button variant="secondary" onClick={() => setIsEditingPhone(true)}>
                                <Edit3 className="h-4 w-4 mr-2" />
                                Edit
                            </Button>
                        )}
                    </div>

                    {!isEditingPhone ? (
                        <div className="flex items-center py-2">
                            <div className="p-2 bg-gray-100 rounded-lg mr-3">
                                <Phone className="h-5 w-5 text-gray-500" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Current Phone Number</p>
                                <p className="text-lg font-medium text-gray-900">
                                    {profile.phoneNumber || <span className="text-gray-400 italic">Not set</span>}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handlePhoneSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                <input
                                    type="tel"
                                    value={phoneNumber}
                                    onChange={(e) => {
                                        setPhoneNumber(e.target.value);
                                        if (errors.phone) setErrors({ ...errors, phone: '' });
                                    }}
                                    placeholder="e.g., +98 912 345 6789"
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                                        errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                    }`}
                                    disabled={updatePhoneMutation.isPending}
                                    autoFocus
                                />
                                {errors.phone && (
                                    <p className="mt-2 text-sm text-red-600 flex items-center">
                                        <AlertCircle className="h-4 w-4 mr-1" />
                                        {errors.phone}
                                    </p>
                                )}
                            </div>
                            <div className="flex space-x-3">
                                <Button type="submit" isLoading={updatePhoneMutation.isPending}>
                                    <Save className="h-4 w-4 mr-2" />
                                    Save Changes
                                </Button>
                                <Button type="button" variant="secondary" onClick={cancelPhoneEdit} disabled={updatePhoneMutation.isPending}>
                                    <X className="h-4 w-4 mr-2" />
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    )}
                </div>
            </Card>

            {/* Password Card */}
            <Card>
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6 pb-4 border-b">
                        <div className="flex items-center">
                            <Key className="h-5 w-5 text-gray-600 mr-2" />
                            <h2 className="text-xl font-semibold text-gray-900">Password & Security</h2>
                        </div>
                        {!isChangingPassword && (
                            <Button variant="secondary" onClick={() => setIsChangingPassword(true)}>
                                <Lock className="h-4 w-4 mr-2" />
                                Change Password
                            </Button>
                        )}
                    </div>

                    {!isChangingPassword ? (
                        <div className="space-y-4">
                            <div className="flex items-center py-2">
                                <div className="p-2 bg-gray-100 rounded-lg mr-3">
                                    <Lock className="h-5 w-5 text-gray-500" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Password</p>
                                    <p className="text-lg font-medium text-gray-900">••••••••••••</p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-500">
                                We recommend changing your password periodically for security.
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handlePasswordSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                                <input
                                    type="password"
                                    value={passwords.currentPassword}
                                    onChange={(e) => {
                                        setPasswords({ ...passwords, currentPassword: e.target.value });
                                        if (errors.currentPassword) setErrors({ ...errors, currentPassword: '' });
                                    }}
                                    placeholder="Enter your current password"
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                                        errors.currentPassword ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                    }`}
                                    disabled={updatePasswordMutation.isPending}
                                    autoFocus
                                />
                                {errors.currentPassword && (
                                    <p className="mt-2 text-sm text-red-600 flex items-center">
                                        <AlertCircle className="h-4 w-4 mr-1" />
                                        {errors.currentPassword}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                                <input
                                    type="password"
                                    value={passwords.newPassword}
                                    onChange={(e) => {
                                        setPasswords({ ...passwords, newPassword: e.target.value });
                                        if (errors.newPassword) setErrors({ ...errors, newPassword: '' });
                                    }}
                                    placeholder="Enter your new password"
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                                        errors.newPassword ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                    }`}
                                    disabled={updatePasswordMutation.isPending}
                                />
                                {errors.newPassword && (
                                    <p className="mt-2 text-sm text-red-600 flex items-center">
                                        <AlertCircle className="h-4 w-4 mr-1" />
                                        {errors.newPassword}
                                    </p>
                                )}
                                <p className="mt-1 text-xs text-gray-500">Must be at least 8 characters</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                                <input
                                    type="password"
                                    value={passwords.confirmPassword}
                                    onChange={(e) => {
                                        setPasswords({ ...passwords, confirmPassword: e.target.value });
                                        if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
                                    }}
                                    placeholder="Confirm your new password"
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                                        errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                    }`}
                                    disabled={updatePasswordMutation.isPending}
                                />
                                {errors.confirmPassword && (
                                    <p className="mt-2 text-sm text-red-600 flex items-center">
                                        <AlertCircle className="h-4 w-4 mr-1" />
                                        {errors.confirmPassword}
                                    </p>
                                )}
                            </div>

                            {errors.password && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-sm text-red-700 flex items-center">
                                        <AlertCircle className="h-4 w-4 mr-2" />
                                        {errors.password}
                                    </p>
                                </div>
                            )}

                            <div className="flex space-x-3 pt-4">
                                <Button type="submit" isLoading={updatePasswordMutation.isPending}>
                                    <Save className="h-4 w-4 mr-2" />
                                    Update Password
                                </Button>
                                <Button type="button" variant="secondary" onClick={cancelPasswordChange} disabled={updatePasswordMutation.isPending}>
                                    <X className="h-4 w-4 mr-2" />
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    )}
                </div>
            </Card>

            {/* Security Note */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-600 flex items-start">
                    <Shield className="h-4 w-4 mr-2 mt-0.5 text-gray-500 flex-shrink-0" />
                    For security reasons, you may be logged out after changing your password.
                </p>
            </div>
        </div>
    );
};
