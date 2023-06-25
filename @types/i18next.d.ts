import ru from '../src/i18n/locales/ru.json';

declare module 'i18next' {
    interface CustomTypeOptions {
        defaultNS: 'main';
        resources: {
            main: typeof ru
        }
    }
}