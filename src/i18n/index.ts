import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "./locales/en";
import uz from "./locales/uz";
import ru from "./locales/ru";
import kaa from "./locales/kaa";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      uz: { translation: uz },
      ru: { translation: ru },
      kaa: { translation: kaa },
    },
    fallbackLng: "en",
    supportedLngs: ["en", "uz", "ru", "kaa"],
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "iq_lang",
    },
  });

export default i18n;
