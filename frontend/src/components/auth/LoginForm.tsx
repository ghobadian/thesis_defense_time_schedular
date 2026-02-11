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
            <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-4xl">
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

                <div className="mt-8 text-sm text-gray-600">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Demo Credentials</h3>

                    {/* Admins Section */}
                    <div className="mb-4">
                        <h4 className="font-semibold text-red-600 mb-2">👨‍💼 Admins (Password: admin123)</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-1 text-xs bg-red-50 p-3 rounded">
                            <div>• Mohammad Rezaei - admin@university.ac.ir</div>
                            <div>• Fatima Ahmadi - admin2@university.ac.ir</div>
                            <div>• Ali Karimi - admin3@university.ac.ir</div>
                            <div>• Sara Hosseini - admin4@university.ac.ir</div>
                        </div>
                    </div>

                    {/* Professors Section */}
                    <div className="mb-4">
                        <h4 className="font-semibold text-blue-600 mb-2">👨‍🏫 Professors (Password: prof123)</h4>
                        <div className="text-xs bg-blue-50 p-3 rounded">
                            <p className="font-medium text-blue-800 mb-1">Department Managers:</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-1 mb-2">
                                <div>• Reza Mohammadi - r.mohammadi@university.ac.ir (Computer Engineering)</div>
                                <div>• Ahmad Mousavi - a.mousavi@university.ac.ir (Electrical Engineering)</div>
                                <div>• Parisa Rahmani - p.rahmani@university.ac.ir (Mechanical Engineering)</div>
                                <div>• Neda Hashemi - n.hashemi@university.ac.ir (Civil Engineering)</div>
                                <div>• Kamran Azizi - k.azizi@university.ac.ir (Industrial Engineering)</div>
                            </div>
                            <p className="font-medium text-blue-800 mb-1">Regular Professors:</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                                <div>• Maryam Alavi - m.alavi@university.ac.ir</div>
                                <div>• Hassan Rahimi - h.rahimi@university.ac.ir</div>
                                <div>• Zahra Jamali - z.jamali@university.ac.ir</div>
                                <div>• Mehdi Naseri - m.naseri@university.ac.ir</div>
                                <div>• Leila Salehi - l.salehi@university.ac.ir</div>
                                <div>• Hossein Abbasi - h.abbasi@university.ac.ir</div>
                                <div>• Javad Kazemi - j.kazemi@university.ac.ir</div>
                                <div>• Saeed Moradi - s.moradi@university.ac.ir</div>
                                <div>• Amir Sadeghi - a.sadeghi@university.ac.ir</div>
                                <div>• Narges Tavakoli - n.tavakoli@university.ac.ir</div>
                                <div>• Davood Yousefi - d.yousefi@university.ac.ir</div>
                                <div>• Fatemeh Akbari - f.akbari@university.ac.ir</div>
                                <div>• Behzad Farahani - b.farahani@university.ac.ir</div>
                                <div>• Mina Ghorbani - m.ghorbani@university.ac.ir</div>
                            </div>
                        </div>
                    </div>

                    {/* Students Section */}
                    <div className="mb-4">
                        <h4 className="font-semibold text-green-600 mb-2">👨‍🎓 Students (Password: student123)</h4>
                        <div className="text-xs bg-green-50 p-3 rounded">
                            <p className="font-medium text-green-800 mb-1">Bachelor Students:</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-1 mb-2">
                                <div>• Ali Nejati - a.nejati@student.university.ac.ir</div>
                                <div>• Mahsa Amini - m.amini@student.university.ac.ir</div>
                                <div>• Hamed Rostami - h.rostami@student.university.ac.ir</div>
                                <div>• Negar Shams - n.shams@student.university.ac.ir</div>
                                <div>• Amin Zarei - a.zarei@student.university.ac.ir</div>
                                <div>• Elham Sharifi - e.sharifi@student.university.ac.ir</div>
                                <div>• Pouya Forouzan - p.forouzan@student.university.ac.ir</div>
                                <div>• Niloofar Ebrahimi - n.ebrahimi@student.university.ac.ir</div>
                                <div>• Omid Ghafari - o.ghafari@student.university.ac.ir</div>
                                <div>• Sanaz Mirzaei - s.mirzaei@student.university.ac.ir</div>
                                <div>• Arash Soltani - a.soltani@student.university.ac.ir</div>
                                <div>• Golnaz Maleki - g.maleki@student.university.ac.ir</div>
                                <div>• Sina Asadi - s.asadi@student.university.ac.ir</div>
                                <div>• Yasmin Sadri - y.sadri@student.university.ac.ir</div>
                                <div>• Ramin Jafari - r.jafari@student.university.ac.ir</div>
                            </div>
                            <p className="font-medium text-green-800 mb-1">Master Students:</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-1 mb-2">
                                <div>• Navid Kiani - n.kiani@student.university.ac.ir</div>
                                <div>• Shiva Ramezani - s.ramezani@student.university.ac.ir</div>
                                <div>• Erfan Hosseinpour - e.hosseinpour@student.university.ac.ir</div>
                                <div>• Kimia Nouri - k.nouri@student.university.ac.ir</div>
                                <div>• Nadia Zahedi - n.zahedi@student.university.ac.ir</div>
                            </div>
                            <p className="font-medium text-green-800 mb-1">PhD Students:</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                                <div>• Mojtaba Esmaili - m.esmaili@student.university.ac.ir</div>
                                <div>• Vida Daneshvar - v.daneshvar@student.university.ac.ir</div>
                                <div>• Kourosh Khalili - k.khalili@student.university.ac.ir</div>
                                <div>• Azadeh Ghasemi - a.ghasemi@student.university.ac.ir</div>
                                <div>• Vahid Bahrami - v.bahrami@student.university.ac.ir</div>
                                <div>• Mahdieh Taheri - m.taheri@student.university.ac.ir</div>
                                <div>• Saeid Moslemi - s.moslemi@student.university.ac.ir</div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Test Section */}
                    <div className="mt-4 p-3 bg-gray-100 rounded">
                        <p className="font-semibold text-gray-700 mb-2">🚀 Quick Test:</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                            <div className="bg-white p-2 rounded shadow-sm">
                                <span className="font-medium">Admin:</span><br/>
                                admin@university.ac.ir<br/>
                                admin123
                            </div>
                            <div className="bg-white p-2 rounded shadow-sm">
                                <span className="font-medium">Professor:</span><br/>
                                r.mohammadi@university.ac.ir<br/>
                                prof123
                            </div>
                            <div className="bg-white p-2 rounded shadow-sm">
                                <span className="font-medium">Student::</span><br/>
                                a.nejati@student.university.ac.ir<br/>
                                student123
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
