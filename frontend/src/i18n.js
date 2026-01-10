import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
    .use(Backend)           // Loads translations from your public folder
    .use(LanguageDetector)  // Detects if browser is in English or Spanish
    .use(initReactI18next)  // Connects to React
    .init({
        fallbackLng: 'en',
        supportedLngs: ['en', 'es'], // <--- Only these two
        debug: true,

        interpolation: {
            escapeValue: false,
        },

        // Where to look for files: public/locales/en/translation.json
        backend: {
            loadPath: '/locales/{{lng}}/translation.json',
        }
    });

export default i18n;