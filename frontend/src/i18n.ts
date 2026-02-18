import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enAdmin from './locales/en/admin.json';
import enCommon from './locales/en/common.json';
import enProfessor from './locales/en/professor.json';
import enStudent from './locales/en/student.json';
import enThesis from './locales/en/thesis.json';

import faAdmin from './locales/fa/admin.json';
import faCommon from './locales/fa/common.json';
import faProfessor from './locales/fa/professor.json';
import faStudent from './locales/fa/student.json';
import faThesis from './locales/fa/thesis.json';

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: {
                admin: enAdmin,
                common: enCommon,
                professor: enProfessor,
                student: enStudent,
                thesis: enThesis,
            },
            fa: {
                admin: faAdmin,
                common: faCommon,
                professor: faProfessor,
                student: faStudent,
                thesis: faThesis,
            }
        },
        defaultNS: 'common',
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
