import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {ReactQueryDevtools} from '@tanstack/react-query-devtools';
import {LoginPage} from './pages/LoginPage';
import {StudentDashboard} from './pages/student/StudentDashboard';
import {ProfessorDashboard} from './pages/professor/ProfessorDashboard';
import {AdminDashboard} from './pages/admin/AdminDashboard';
import {ProtectedRoute} from './components/auth/ProtectedRoute';
import {UserRole} from './types';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: false,
        },
    },
});

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <Router>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />

                    {/* Student Routes */}
                    <Route
                        path="/student/*"
                        element={
                            <ProtectedRoute allowedRoles={[UserRole.STUDENT]}>
                                <StudentDashboard />
                            </ProtectedRoute>
                        }
                    />

                    {/* Professor Routes */}
                    <Route
                        path="/professor/*"
                        element={
                            <ProtectedRoute allowedRoles={[UserRole.PROFESSOR, UserRole.MANAGER]}>
                                <ProfessorDashboard />
                            </ProtectedRoute>
                        }
                    />

                    {/* Admin Routes */}
                    <Route
                        path="/admin/*"
                        element={
                            <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                                <AdminDashboard />
                            </ProtectedRoute>
                        }
                    />

                    <Route path="/" element={<Navigate to="/login" replace />} />
                </Routes>
            </Router>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}

export default App;
