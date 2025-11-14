import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from '../../components/layout/Layout';
import { AdminHome } from './AdminHome';
import { StudentRegistration } from './StudentRegistration';
import AdminThesisFormsPage from "./AdminThesisFormsPage";
import {StudentManagement} from "./StudentManagement";

export const AdminDashboard: React.FC = () => {
    return (
        <Layout>
            <Routes>
                <Route path="dashboard" element={<AdminHome />} />
                <Route path="register-student" element={<StudentRegistration />} />
                <Route path="*" element={<AdminHome />} />
                <Route path="users" element={<StudentManagement />} />
                {/*<Route path="departments" element={<AdminDepartments />} />*/}
                {/*<Route path="fields" element={<AdminFields />} />*/}
                <Route path="thesis-forms" element={<AdminThesisFormsPage />} />
                {/*<Route path="meetings" element={<AdminMeetings />} />*/}
                {/*<Route path="reports" element={<AdminReports />} />*/}
            </Routes>
        </Layout>
    );
};
