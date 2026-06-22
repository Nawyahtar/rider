import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';

import { supportedLanguages, translations } from '../localization/translations';

const LANGUAGE_STORAGE_KEY = 'appLanguage';

export const LanguageContext = createContext({
  language: 'en',
  languages: supportedLanguages,
  setLanguage: () => {},
  t: key => key,
});

const getTranslation = (language, key) => {
  const value = key.split('.').reduce(
    (current, part) => current?.[part],
    translations[language]
  );

  return value ?? key;
};

const interpolate = (value, params) => (
  Object.entries(params).reduce(
    (result, [key, replacement]) => result.replaceAll(`{{${key}}}`, String(replacement)),
    value
  )
);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState('en');

  useEffect(() => {
    AsyncStorage.getItem(LANGUAGE_STORAGE_KEY)
      .then(savedLanguage => {
        if (supportedLanguages.includes(savedLanguage)) {
          setLanguageState(savedLanguage);
        }
      })
      .catch(() => {});
  }, []);

  const setLanguage = useCallback(nextLanguage => {
    if (!supportedLanguages.includes(nextLanguage)) {
      return;
    }

    setLanguageState(nextLanguage);
    AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage).catch(() => {});
  }, []);

  const t = useCallback(
    (key, params = {}) => interpolate(getTranslation(language, key), params),
    [language]
  );

  const value = useMemo(() => ({
    language,
    languages: supportedLanguages,
    setLanguage,
    t,
  }), [language, setLanguage, t]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
