import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { authAPI } from '../../api/auth.api';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { UserRole } from '../../types';

export const LoginForm: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const setAuth = useAuthStore((state) => state.setAuth);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await authAPI.login({ email, password });

            // Debug logging
            console.log('Full response:', response);
            console.log('Response role:', response.role);
            console.log('Response role type:', typeof response.role);

            // Normalize the role - handle both string and enum cases
            let role: UserRole;
            if (typeof response.role === 'string') {
                // If role comes as string, convert it to enum
                role = UserRole[response.role as keyof typeof UserRole];
            } else {
                role = response.role;
            }

            console.log('Normalized role:', role);
            console.log('UserRole enum values:', UserRole);

            setAuth(response.accessToken, role, response.userId);

            // Navigate based on role - use setTimeout to ensure state is updated
            setTimeout(() => {
                switch (role) {
                    case UserRole.ADMIN:
                        console.log('Navigating to admin dashboard');
                        navigate('/admin/dashboard', { replace: true });
                        break;
                    case UserRole.PROFESSOR:
                    case UserRole.MANAGER:
                        console.log('Navigating to professor dashboard');
                        navigate('/professor/dashboard', { replace: true });
                        break;
                    case UserRole.STUDENT:
                        console.log('Navigating to student dashboard');
                        navigate('/student/dashboard', { replace: true });
                        break;
                    default:
                        console.log('Unknown role, navigating to home');
                        navigate('/', { replace: true });
                }
            }, 100);

        } catch (err: any) {
            console.error('Login error:', err);
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-500 to-primary-700">
            <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
                    Thesis Defense Scheduler
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your.email@university.ac.ir"
                        required
                    />

                    <Input
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                    />

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                            {error}
                        </div>
                    )}

                    <Button
                        type="submit"
                        isLoading={isLoading}
                        className="w-full"
                    >
                        Login
                    </Button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-600">
                    <p>Demo Credentials:</p>
                    <p className="mt-2">Admin: admin@test.com / Test123!</p>
                    <p>Professor: prof@test.com / Test123!</p>
                    <p>Student: student@test.com / Test123!</p>
                </div>
            </div>
        </div>
    );
};
