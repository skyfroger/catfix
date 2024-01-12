# Котфикс - проверка Scratch-проектов

Проект предназначен для проверки качества и оценки сложности Scratch-проектов.

После загрузки файла с проектом, пользователь увидит оценку сложности проекта: используются ли составные условия, переменные, собственные блоки и другие продвинутые блоки.

Также планируется добавить раздел с описанием моментов на которые разработчику нужно обратить внимание: не используемые переменные, стандартные имена спрайтов и др.

## Для разработки

Запуск тестового сервера:

```bash
npm start
```

Сервер будет доступен по следующей ссылке: [http://localhost:3000](http://localhost:3000)

Создание билда для размещения:

```bash
npm run build
```

### Локализация

Файлы с локализацией находятся в папке `src/i18n/locales`. Это json-файлы с набором ключей и значений. Чтобы добавить новую локализацию нужно сделать следующее.

В папку `locales` добавляем json-файл с именем языка, согласно iso-коду. Добавляем импорт этого файла в `i18n/locales/config.ts`:

```typescript
import ru from "./locales/ru.json";
import be from "./locales/be.json";
```

Добавляем новый язык к переменной `resources`:

```typescript
export const resources = {
    ru: {
        main: ru,
    },
    be: {
        main: be,
    },
};
```

Ключ - код языка.

Добавляем язык в меню выбора. В компоненте `src/components/ui/LangSelector.tsx` добавляем объект к массиву `options` элемента `Select`:

```typescript
options={[
    { value: "ru", label: "Русский" },
    { value: "be", label: "Беларуская" },
]}
```

Далее нужно исправить компонент `src/components/ui/ScratchCode.tsx`. Компонент отвечает за вывод локализованных фрагментов Scratch-кода. Нужно импортировать json-файл с новым языком:

```typescript
import be from "scratchblocks/locales/be.json";
import ru from "scratchblocks/locales/ru.json";
```

JSON-файлы для разных языков импортируются из модуля `scratchblocks`. Добавляем импортированные языки к списку используемых:

```typescript
scratchblocks.loadLanguages({ be, ru });
```

В компоненте `ScratchBlocks` нужно добавить ключ с новым языком:

```typescript
<ScratchBlocks
    blockStyle="scratch3"
    languages={["en", "be", "ru"]} // Код языка добавляется тут
>
```

### Модуль парсинга Scratch-блоков

Модуль parse-sb3-blocks устанавливается из github-репозитория и необходим чтобы преобразовать json-файл проекта в более читаемый формат.

После обновления репозитория с модулем, его нужно установить в проект. Для этого нужно запустить команду

```bash
npm install git+https://github.com/skyfroger/parse-sb3-blocks.git
```

Если возникают ошибки, нужно добавить к команде ключ ` --force`
