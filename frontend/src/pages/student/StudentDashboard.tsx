import React from 'react';
import {Routes, Route} from 'react-router-dom';
import {Layout} from '../../components/layout/Layout';
import {StudentHomePage} from './StudentHomePage';
import {StudentMeetingsPage} from './StudentMeetingsPage';
import {ProfilePage} from '../common/ProfilePage';
import {ThesisFormCreate} from "../../components/student/ThesisFormCreate";
import StudentFormsPage from "./StudentFormsPage";

export const StudentDashboard: React.FC = () => {
    return (
        <Layout>
            <Routes>
                <Route path="dashboard" element={<StudentHomePage/>}/>
                <Route path="thesis-form" element={<StudentFormsPage/>}/>
                <Route path="meetings" element={<StudentMeetingsPage/>}/>
                <Route path="profile" element={<ProfilePage/>}/>
                <Route path="thesis/create" element={<ThesisFormCreate/>}/>
                <Route path="thesis" element={<StudentFormsPage/>}/>
                <Route path="*" element={<StudentHomePage/>}/>
            </Routes>
        </Layout>
    );
};
