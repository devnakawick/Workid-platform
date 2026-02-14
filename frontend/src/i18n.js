import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enTranslation from './locales/en/translation.json';
import siTranslation from './locales/si/translation.json';
import taTranslation from './locales/ta/translation.json';

i18n
    // Detect user language
    .use(LanguageDetector)
    // Pass the i18n instance to react-i18next
    .use(initReactI18next)
    // Initialize i18next
    .init({
        resources: {
            en: { translation: enTranslation },
            si: { translation: siTranslation },
            ta: { translation: taTranslation }
        },
        fallbackLng: 'en', // Fallback language if translation is missing
        debug: false, // Set to true for development debugging

        interpolation: {
            escapeValue: false // React already escapes values
        },

        // Language detection options
        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage']
        }
    });

export default i18n;
