import React from 'react';
import {DepartmentSummary} from "../../types";
import {useTranslation} from "react-i18next";

interface DepartmentFilterProps {
    value: string;
    onChange: (value: string) => void;
    departments: Array<DepartmentSummary>;
}

export const DepartmentFilter: React.FC<DepartmentFilterProps> = ({
                                                                      value,
                                                                      onChange,
                                                                      departments = []
                                                                  }) => {
    const {t} = useTranslation("admin");
    return (
        <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={value}
            onChange={(e) => onChange(e.target.value)}>

            <option value="">{t("all_departments")}</option>
            {departments.map((dept) =>
                <option key={dept.id} value={dept.id}>
                    {dept.name}
                </option>
            )}
        </select>);

};