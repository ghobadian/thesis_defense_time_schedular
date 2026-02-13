import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from '../../components/layout/Layout';
import { ProfessorHomePage } from './ProfessorHomePage';
import { ProfessorStudentsPage } from "./ProfessorStudentsPage";
import { ProfessorMeetingsPage } from "./ProfessorMeetingsPage";
import { ProfessorSpecifyMeetingTimeSlotsPage } from './ProfessorSpecifyMeetingTimeSlotsPage';
import {ProfilePage} from "../ProfilePage";
import ProfessorThesisFormsPage from "./ProfessorFormsPage";

export const ProfessorDashboard: React.FC = () => {
    return (
        <Layout>
            <Routes>
                <Route path="dashboard" element={<ProfessorHomePage />} />
                <Route path="thesis-forms" element={<ProfessorThesisFormsPage />} />
                <Route path="students" element={<ProfessorStudentsPage />} />
                <Route path="meetings" element={<ProfessorMeetingsPage />} />
                <Route path="meetings/:meetingId/specify-time" element={<ProfessorSpecifyMeetingTimeSlotsPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="*" element={<ProfessorHomePage />} />
            </Routes>
        </Layout>
    );
};
