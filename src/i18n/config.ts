import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import ru from "./locales/ru.json";
import be from "./locales/be.json";
import en from "./locales/en.json";

export const resources = {
    ru: {
        main: ru,
    },
    be: {
        main: be,
    },
    en: {
        main: en,
    },
};

const languageDetector = new LanguageDetector(null, {
    convertDetectedLanguage: (lng) => lng.slice(0, 2).toLowerCase()
});

i18n.use(languageDetector).use(initReactI18next).init({
    resources,
    defaultNS: "main",
    debug: true,
    fallbackLng: "ru",
});

export default i18n;
