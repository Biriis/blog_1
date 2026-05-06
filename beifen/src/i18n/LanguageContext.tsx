import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, translations } from './translations';

type TranslationKey = 'home' | 'myBlog' | 'welcome' | 'welcomeSubtitle' | 'latestArticles' | 'discoverContent' | 'loading' | 'noArticles' | 'stayTuned' | 'readMore' | 'searchPlaceholder' | 'searchButton' | 'searchResults' | 'searching' | 'noResults' | 'tryDifferentKeywords' | 'backToList' | 'articleNotFound' | 'backToHome' | 'publishDate' | 'lastUpdated' | 'tags' | 'draft' | 'viewArticle' | 'allRightsReserved' | 'siteName' | 'siteDescription' | 'defaultKeywords';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const stored = localStorage.getItem('language');
    if (stored === 'zh' || stored === 'en') {
      return stored;
    }
    const browserLang = navigator.language.toLowerCase();
    return browserLang.startsWith('zh') ? 'zh' : 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: TranslationKey): string => {
    return translations[language][key] || translations.zh[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
