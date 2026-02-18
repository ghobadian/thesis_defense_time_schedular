// src/components/common/meeting/MeetingJuryList.tsx
import React from 'react';
import {Users} from 'lucide-react';
import {Meeting, SimpleUser} from '../../../types';
import {useTranslation} from "react-i18next";

interface MeetingJuryListProps {
    meeting: Meeting;
}

export const MeetingJuryList: React.FC<MeetingJuryListProps> = ({meeting}) => {
    const {t} = useTranslation("common"); // ✅ Now inside the component

    return (
        <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3">{t("jury_members_1")}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {meeting.juryMembers && meeting.juryMembers.length > 0 ?
                    meeting.juryMembers.map((jury: SimpleUser) =>
                        <div key={jury.id} className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-start">
                                <div className="bg-primary-100 rounded-full p-2 mr-3">
                                    <Users className="h-5 w-5 text-primary-600"/>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">
                                        {jury.firstName} {jury.lastName}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {meeting.thesis.instructorId === jury.id ? 'Instructor' : 'Professor'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-500 text-sm">{t("no_jury_members_assigned_yet")}</p>
                    )}
            </div>
        </div>
    );
};
