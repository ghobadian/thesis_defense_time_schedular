import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from '../../components/layout/Layout';
import { AdminHome } from './AdminHome';
import { StudentRegistration } from './StudentRegistration';
import AdminThesisFormsPage from "./AdminThesisFormsPage";
import {StudentManagement} from "./StudentManagement";
import {DefenseMeetings} from "./DefenseMeetings";
import {Departments} from "./Departments";
import AdminFieldsPage from "./AdminFieldsPage";
import StudentEdit from './StudentEdit';
import {ProfilePage} from "../student/ProfilePage";
import ProfessorManagement from "./ProfessorManagement";

export const AdminDashboard: React.FC = () => {
    return (
        <Layout>
            <Routes>
                <Route path="dashboard" element={<AdminHome />} />
                <Route path="register-student" element={<StudentRegistration />} />
                <Route path="*" element={<AdminHome />} />
                <Route path="students" element={<StudentManagement />} />
                <Route path="professors" element={<ProfessorManagement />} />
                <Route path="departments" element={<Departments />} />
                <Route path="fields" element={<AdminFieldsPage />} />
                <Route path="thesis-forms" element={<AdminThesisFormsPage />} />
                <Route path="meetings" element={<DefenseMeetings />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="edit-student/:id" element={<StudentEdit />} />
            </Routes>
        </Layout>
    );
};
