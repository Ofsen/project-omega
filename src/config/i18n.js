import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';

import en from '../utils/lang/en.js';
import fr from '../utils/lang/fr.js';
import {languageDetector} from '../utils/lang/languageDetector.js';
const resources = {
  en,
  fr,
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources,
    compatibilityJSON: 'v3',
    debug: true,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
