import i18n from 'i18next'
import Backend from 'i18next-xhr-backend'
import { initReactI18next } from 'react-i18next'
import { env } from './env.js'

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    lng: 'en',
    backend: {
      /* translation file path */
      // loadPath: '/config/{{ns}}/{{lng}}.json'
      loadPath:
        env.REACT_APP_BASE === undefined
          ? `./config/{{ns}}/{{lng}}.json`
          : `${env.REACT_APP_BASE}/config/{{ns}}/{{lng}}.json`
    },
    fallbackLng: 'en',
    debug: false,
    /* can have multiple namespace, in case you want to divide a huge translation into smaller pieces and load them on demand */
    ns: ['translations'],
    defaultNS: 'translations',
    keySeparator: false,
    interpolation: {
      escapeValue: false,
      formatSeparator: ','
    },
    react: {
      useSuspense: true
    }
  })

export default i18n
