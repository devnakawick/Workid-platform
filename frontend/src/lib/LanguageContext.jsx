import { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const SUPPORTED_LANGUAGES = ['en', 'si', 'ta'];

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const { i18n } = useTranslation();

  // Initialize from localStorage 
  const getInitialLanguage = () => {
    const stored = localStorage.getItem('language');
    if (SUPPORTED_LANGUAGES.includes(stored)) return stored;

    const browserLang = navigator.language.split('-')[0].toLowerCase();
    if (SUPPORTED_LANGUAGES.includes(browserLang)) return browserLang;

    return 'en';
  };

  const [language, setLanguage] = useState(getInitialLanguage);

  // Sync context 
  useEffect(() => {
    if (i18n.language !== language) {
      i18n.changeLanguage(language);
    }
    localStorage.setItem('language', language);
    document.documentElement.lang = language; // accessibility + SEO
  }, [language, i18n]);

  const changeLanguage = (lang) => {
    if (!SUPPORTED_LANGUAGES.includes(lang)) {
      console.warn(`Unsupported language: ${lang}. Falling back to 'en'`);
      lang = 'en';
    }
    setLanguage(lang);
  };

  const value = {
    language,
    changeLanguage,
    supportedLanguages: SUPPORTED_LANGUAGES,
    isRtl: false, 
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};