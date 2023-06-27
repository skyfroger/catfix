import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import ru from "./locales/ru.json";
import by from "./locales/by.json";

export const resources = {
    ru: {
        main: ru,
    },
    by: {
        main: by,
    },
};

i18n.use(initReactI18next).init({
    resources,
    defaultNS: "main",
    debug: true,
    fallbackLng: "ru",
});

export default i18n;
