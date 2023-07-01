import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import ru from "./locales/ru.json";
import be from "./locales/be.json";

export const resources = {
    ru: {
        main: ru,
    },
    be: {
        main: be,
    },
};

i18n.use(initReactI18next).init({
    resources,
    defaultNS: "main",
    debug: true,
    fallbackLng: "ru",
});

export default i18n;
