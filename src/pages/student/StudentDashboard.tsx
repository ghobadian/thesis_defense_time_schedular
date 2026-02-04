import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from '../../components/layout/Layout';
import { StudentHome } from './StudentHome';
import { MeetingsPage } from './MeetingsPage';
import { ProfilePage } from './ProfilePage';
import {ThesisFormCreate} from "../../components/student/ThesisFormCreate";
import StudentThesisForms from "./StudentThesisForms";

export const StudentDashboard: React.FC = () => {
    return (
        <Layout>
            <Routes>
                <Route path="dashboard" element={<StudentHome />} />
                <Route path="thesis-form" element={<StudentThesisForms />} />
                <Route path="meetings" element={<MeetingsPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="thesis/create" element={<ThesisFormCreate />} />
                <Route path="thesis" element={<StudentThesisForms />} />
                <Route path="*" element={<StudentHome />} />
            </Routes>
        </Layout>
    );
};
