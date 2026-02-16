import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from '../../components/layout/Layout';
import { AdminHomePage } from './AdminHomePage';
import { AdminStudentRegistrationPage } from './AdminStudentRegistrationPage';
import AdminThesisFormsPage from "./AdminThesisFormsPage";
import {AdminStudentManagementPage} from "./AdminStudentManagementPage";
import {AdminMeetingsPage} from "./AdminMeetingsPage";
import {AdminDepartmentsPage} from "./AdminDepartmentsPage";
import AdminFieldsPage from "./AdminFieldsPage";
import AdminStudentEditPage from './AdminStudentEditPage';
import {ProfilePage} from "../common/ProfilePage";
import AdminProfessorManagementPage from "./AdminProfessorManagementPage";

export const AdminDashboard: React.FC = () => {
    return (
        <Layout>
            <Routes>
                <Route path="dashboard" element={<AdminHomePage />} />
                <Route path="register-student" element={<AdminStudentRegistrationPage />} />
                <Route path="*" element={<AdminHomePage />} />
                <Route path="students" element={<AdminStudentManagementPage />} />
                <Route path="professors" element={<AdminProfessorManagementPage />} />
                <Route path="departments" element={<AdminDepartmentsPage />} />
                <Route path="fields" element={<AdminFieldsPage />} />
                <Route path="thesis-forms" element={<AdminThesisFormsPage />} />
                <Route path="meetings" element={<AdminMeetingsPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="edit-student/:id" element={<AdminStudentEditPage />} />
            </Routes>
        </Layout>
    );
};
