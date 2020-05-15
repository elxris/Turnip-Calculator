import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import { translations } from "./locales";

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    // we init with resources
    debug: true,
    detection: {
      // order and from where user language should be detected
      order: [
        "querystring",
        "cookie",
        "localStorage",
        "navigator",
        "htmlTag",
        "path",
        "subdomain",
      ],
    },

    fallbackLng: "en",

    keySeparator: false, // we use content as keys

    interpolation: {
      escapeValue: false,
    },

    resources: translations,

    react: {
      useSuspense: false,
    },

    // have a common namespace used around the full app
    ns: ["translations"],
    defaultNS: "translations",
  });

export default i18n;
