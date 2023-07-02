/**
 * Вспомогательные функции для парсинга проекта
 */

import { Project, Sprite } from "../../@types/parsedProject";
import { ScratchProject, Target } from "../../@types/scratch";

import { toScratchblocks } from "parse-sb3-blocks/dist/parse-sb3-blocks.module";

// список кодов для блоков-тригеров
const HAT_BLOCKS = [
    "event_whenflagclicked",
    "event_whenkeypressed",
    "event_whengreaterthan",
    "event_whenthisspriteclicked",
    "event_whenstageclicked",
    "event_whenbackdropswitchesto",
    "event_whenbroadcastreceived",
    "control_start_as_clone",
    "procedures_definition",
    "boost_whenColor",
    "boost_whenTilted",
    "ev3_whenButtonPressed",
    "ev3_whenDistanceLessThan",
    "ev3_whenBrightnessLessThan",
    "gdxfor_whenGesture",
    "gdxfor_whenForcePushedOrPulled",
    "gdxfor_whenTilted",
    "makeymakey_whenMakeyKeyPressed",
    "makeymakey_whenCodePressed",
    "microbit_whenButtonPressed",
    "microbit_whenGesture",
    "microbit_whenTilted",
    "microbit_whenPinConnected",
    "wedo2_whenDistance",
    "wedo2_whenTilted",
    "videoSensing_whenMotionGreaterThan",
];

// код блока с названием процедуры пользователя
const PROCEDURES_PROTOTYPE = "procedures_prototype";

function parseTarget(sprite: Target): Sprite {
    /**
     * Парсинг полей отдельного спрайта
     */

    // заготовка спрайта
    let parsedSprite: Sprite = {
        name: "",
        scripts: [],
        allScripts: "",
        customBlocks: [],
        localVars: [],
        localLists: [],
    };

    // сохраняем имя спрайта
    parsedSprite.name = sprite.name;

    // сохраняем имена локальных переменных
    for (const key in sprite.variables) {
        parsedSprite.localVars.push(String(sprite.variables[key][0]));
    }

    // сохраняем имена локальных списков
    for (const key in sprite.lists) {
        parsedSprite.localLists.push(String(sprite.lists[key][0]));
    }

    // список id стартовых блоков спрайта
    const spriteCapIDs = Object.keys(sprite.blocks).filter((key) =>
        HAT_BLOCKS.includes(sprite.blocks[key].opcode)
    );

    // получаем и сохраняем список имён блоков, описанных пользователем
    const customBlockIDs: string[] = Object.keys(sprite.blocks).filter(
        (key) => sprite.blocks[key].opcode === PROCEDURES_PROTOTYPE
    );
    customBlockIDs.forEach((id: string) => {
        parsedSprite.customBlocks.push(sprite.blocks[id].mutation.proccode);
    });

    // сохраняем валидные скрипты спрайта (единичный блок-шапка не будет валидным скриптом)
    spriteCapIDs.forEach((hat) => {
        // получаем удобочитаемый текст скрипта
        try {
            const script: string = toScratchblocks(hat, sprite.blocks, "en", {
                tab: "  ",
                variableStyle: "always",
            });

            // если в результате получилась только одна строка, то в скрипте только один блок
            // такой скрипт не считается валидным
            if (script.includes("\n")) {
                parsedSprite.scripts.push(script);
            }
        } catch (e) {
            /*
            TODO в библиотеке парсинга есть ошибка: в некоторых случаях в JSON могут
            быть поля равные null. Парсер перестаёт работать. Пока просто пропускаем
            такие скрипты
            */
            console.error(
                hat,
                "В скрипте есть пустое условие или пусткой C-блок. Невозможно обработать!"
            );
        }
    });

    // объединяем скрипти спрайта в одну строку
    parsedSprite.allScripts = parsedSprite.scripts.reduce(
        (previousValue, currentValue) => {
            return previousValue + currentValue + "\n\n";
        },
        ""
    );

    return parsedSprite;
}

function parseProject(scratchProject: ScratchProject): Project {
    /**
     * Парсинг полей проекта
     */

    let s: Sprite = {
        name: "",
        scripts: [],
        allScripts: "",
        customBlocks: [],
        localVars: [],
        localLists: [],
    };

    // заготовка итогового проекта
    let project: Project = {
        broadcasts: [],
        stage: s,
        sprites: [],
        allScripts: "",
    };

    // парсим сцену проекта
    const stage = scratchProject.targets.filter((t: Target) => t.isStage)[0];
    project.stage = parseTarget(stage);

    // парсим спрайты проекта
    const targets: Target[] = scratchProject.targets.filter(
        (t: Target) => !t.isStage
    );
    targets.forEach((t: Target) => {
        project.sprites.push(parseTarget(t));
    });

    // cохраняем все скрипты проекта в одну строку, чтобы использовать её для поиска по регулярным выражениям
    let scriptsString: string = project.sprites.reduce(
        (previousValue: string, currentSprite: Sprite) => {
            return previousValue + "\n\n" + currentSprite.scripts.join("\n\n");
        },
        ""
    );
    scriptsString += "\n\n" + project.stage.scripts.join("\n\n");
    project.allScripts = scriptsString;

    // получаем список передаваемых сообщений
    project.broadcasts = Object.values(stage.broadcasts);

    return project;
}

export default parseProject;
