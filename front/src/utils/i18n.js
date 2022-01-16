import i18next from 'i18next';

import translationEN from './translations/en.json';
import translationES from './translations/es.json';

i18next
  .init({
    interpolation: {
      // React already does escaping
      escapeValue: false,
    },
    lng: 'en',
    resources: {
      en: {
        translation: translationEN
      },
      es: {
        translation: translationES
      }
    },
  })

export default i18next