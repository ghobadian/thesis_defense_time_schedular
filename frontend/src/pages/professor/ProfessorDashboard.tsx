import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from '../../components/layout/Layout';
import { ProfessorHome } from './ProfessorHome';
import { MyStudents } from "./MyStudents";
import { MyMeetings } from "./MyMeetings";
import { SpecifyMeetingTimeSlots } from './SpecifyMeetingTimeSlots';
import {ProfilePage} from "../student/ProfilePage";
import ProfessorThesisFormsPage from "./ProfessorThesisForms";

export const ProfessorDashboard: React.FC = () => {
    return (
        <Layout>
            <Routes>
                <Route path="dashboard" element={<ProfessorHome />} />
                <Route path="thesis-forms" element={<ProfessorThesisFormsPage />} />
                <Route path="students" element={<MyStudents />} />
                <Route path="meetings" element={<MyMeetings />} />
                <Route path="meetings/:meetingId/specify-time" element={<SpecifyMeetingTimeSlots />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="*" element={<ProfessorHome />} />
            </Routes>
        </Layout>
    );
};
