// src/components/admin/StudentTypeFilter.tsx
import React from 'react';
import {StudentType} from "../../types";
import {useTranslation} from "react-i18next";

interface StudentTypeFilterProps {
    value: string;
    onChange: (value: string) => void;
}

export const StudentTypeFilter: React.FC<StudentTypeFilterProps> = ({
                                                                        value,
                                                                        onChange
                                                                    }) => {
    const {t} = useTranslation("admin");
    return (
        <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={value}
            onChange={(e) => onChange(e.target.value)}>

            <option value="">{t("all_student_types")}</option>
            <option value={StudentType.BACHELOR}>{t("bachelor")}</option>
            <option value={StudentType.MASTER}>{t("master")}</option>
            <option value={StudentType.PHD}>{t("phd")}</option>
        </select>);

};