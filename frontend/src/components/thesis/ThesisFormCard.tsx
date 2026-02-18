// src/components/thesis/ThesisFormCard.tsx

import React from 'react';
import {ThesisForm} from '../../types';
import {
    formatDate,
    getFullName,
    getStatusBadgeClass,
    getStatusLabel
} from
        '../utils/ThesisFormUtils';
import {useTranslation} from "react-i18next";

interface Props {
    form: ThesisForm;
    selected: boolean;
    onSelect: () => void;
}

export const ThesisFormCard: React.FC<Props> = ({form, selected, onSelect}) =>
{
    const {t} = useTranslation("thesis");
    return (<div className={`form-card ${selected ? 'selected' : ''}`} onClick={onSelect}>
        <div className="form-card-header">
            <h3>{form.title}</h3>
            <span className={`form-badge ${getStatusBadgeClass(form.state)}`}>
                {getStatusLabel(form.state)}
            </span>
        </div>
        <div className="form-card-body">
            <p className="form-abstract">
                {form.abstractText.substring(0, 150)}...
            </p>
            <div className="form-meta">
                <span>{t("student")}{getFullName(form.studentFirstName, form.studentLastName)}</span>
                <span>{t("submitted")}{formatDate(form.createdAt)}</span>
            </div>
        </div>
    </div>)
};