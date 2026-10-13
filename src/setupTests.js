// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toBeInTheDocument();
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Minimal i18n instance so components using useTranslation() resolve default values and interpolation in tests.
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({ lng: 'en', fallbackLng: 'en', resources: {}, interpolation: { escapeValue: false } });
