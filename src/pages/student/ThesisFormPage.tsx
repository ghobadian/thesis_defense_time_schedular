import { ThesisFormCreate } from '../../components/student/ThesisFormCreate';
import { MyThesisForms } from './MyThesisForms';
import React from "react";

export const ThesisFormPage: React.FC = () => {
    return (
        <div className="space-y-8">
            <ThesisFormCreate />
            <MyThesisForms />
        </div>
    );
};
