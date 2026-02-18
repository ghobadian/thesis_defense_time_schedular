// src/components/common/meeting/MeetingThesisInfo.tsx
import React from 'react';
import {Mail} from 'lucide-react';
import {Meeting} from '../../../types';
import {useTranslation} from "react-i18next";

interface MeetingThesisInfoProps {
    meeting: Meeting;
    userRole: 'professor' | 'student';
}

export const MeetingThesisInfo: React.FC<MeetingThesisInfoProps> = ({meeting, userRole}) =>
{
    const {t} = useTranslation("common");
    return (<div>
        <h4 className="text-lg font-semibold text-gray-900 mb-3">{t("thesis_information")}</h4>
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <p className="text-sm text-gray-500">{t("student_name")}</p>
                    <p className="font-medium text-gray-900">
                        {meeting.thesis?.studentFirstName} {meeting.thesis?.studentLastName}
                    </p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">{t("instructor_name")}</p>
                    <p className="font-medium text-gray-900">
                        {meeting.thesis?.instructorFirstName} {meeting.thesis?.instructorLastName}
                    </p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">{t("student_number")}</p>
                    <p className="font-medium text-gray-900">
                        {meeting.thesis?.studentNumber || 'N/A'}
                    </p>
                </div>
                {userRole === 'professor' &&
                    <div>
                        <p className="text-sm text-gray-500">{t("email")}</p>
                        <p className="font-medium text-gray-900 flex items-center">
                            <Mail className="h-4 w-4 mr-2 text-gray-400"/>
                            {meeting.thesis?.studentEmail || 'N/A'}
                        </p>
                    </div>
                }
                <div>
                    <p className="text-sm text-gray-500">{t("field")}</p>
                    <p className="font-medium text-gray-900">
                        {meeting.thesis?.fieldName || 'N/A'}
                    </p>
                </div>
            </div>
            <div className="pt-2">
                <p className="text-sm text-gray-500">{t("abstract")}</p>
                <p className="text-gray-900 mt-1">
                    {meeting.thesis?.abstractText || 'No abstract available'}
                </p>
            </div>
            <div className="pt-2">
                <p className="text-sm text-gray-500">{t("score")}</p>
                <p className="text-gray-900 mt-1">
                    {meeting.score || 'Not Given Yet'}
                </p>
            </div>
        </div>
    </div>);
};