import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from '../../components/layout/Layout';
import { ProfessorHome } from './ProfessorHome';
import { ThesisFormReview } from '../../components/professor/ThesisFormReview';
import { TimeSlotManagement } from '../../components/professor/TimeSlotManagement';
import {MyStudents} from "./MyStudents";
import {MyMeetings} from "./MyMeetings";
import {MyThesisForms} from "./MyThesisForms";
import {SpecifyMeetingTimeSlots} from "./SpecifyMeetingTimeSlots";

export const ProfessorDashboard: React.FC = () => {
    return (
        <Layout>
            <Routes>
                <Route path="dashboard" element={<ProfessorHome />} />
                <Route path="thesis-forms" element={<MyThesisForms />} />
                <Route path="time-slots" element={<TimeSlotManagement />} />
                <Route path="students" element={<MyStudents />} />
                <Route path="meetings" element={<MyMeetings />} />
                <Route path="meetings/:meetingId/specify-time" element={<SpecifyMeetingTimeSlots />} />
                <Route path="*" element={<ProfessorHome />} />
            </Routes>
        </Layout>
    );
};
