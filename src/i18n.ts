import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en';
import el from './locales/el';
import { langFromPath } from './lib/lang';

// The language comes from the URL (/el = Greek), not the browser, so each
// address always shows the same language to visitors and to Google.
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      el: { translation: el },
    },
    lng: langFromPath(window.location.pathname),
    fallbackLng: "en",
    interpolation: { escapeValue: false }
  });

export default i18n;
