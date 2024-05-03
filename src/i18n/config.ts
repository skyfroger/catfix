import i18n from "i18next";
import detector from "i18next-browser-languagedetector";
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

i18n.use(detector).use(initReactI18next).init({
    resources,
    defaultNS: "main",
    debug: true,
    fallbackLng: "ru",
});

export default i18n;
