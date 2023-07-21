/**
 * Вспомогательные функции для парсинга проекта
 */

import { Project, Sprite } from "../../@types/parsedProject";
import { Block, ScratchProject, Target } from "../../@types/scratch";

import { toScratchblocks } from "parse-sb3-blocks/dist/parse-sb3-blocks.module";

// список кодов для блоков-тригеров
export const HAT_BLOCKS = [
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
export const PROCEDURES_PROTOTYPE = "procedures_prototype";

/**
 * Эскейпим символы в строке, которые помешают парсингу Scratchblocks
 * @param text входной текст
 * @param onlyRight нужно ли эскейпить только закрывающие скобки или все
 */
export function escapeSB(text: string, onlyRight: boolean = true) {
    return onlyRight
        ? text.replace(/([\]\)>])/g, `\\$&`)
        : text.replace(/([\]\)><\(\[])/g, `\\$&`);
}

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
        comments: false,
        coords: [],
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

                // сохраняем координаты hat-блока
                const x = sprite.blocks[hat].x;
                const y = sprite.blocks[hat].y;

                const linesCount = script.split("\n");

                // высота скрипта: количество строк умноженное на высоту одной строки
                // число подобрано экспериментально
                const h = linesCount.length * 45;

                // за ширину берём медианную длину строки
                // умножаем количество символов в строке на ширину одного символа
                const w =
                    median(
                        linesCount.map((line) => {
                            return line.length;
                        })
                    ) * 5;

                parsedSprite.coords.push({ x: x ?? 0, y: y ?? 0, w: w, h: h });
            }
        } catch (e) {
            /*
            TODO в библиотеке парсинга есть ошибка: в некоторых случаях в JSON могут
            быть поля равные null. Парсер перестаёт работать. Пока просто пропускаем
            такие скрипты
            */
            console.warn(
                hat,
                "Скорее всего в скрипте есть пустой блок, который не получается обработать. Весь скрипт пропускается!"
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

    // есть ли комментарии в этом спрайте

    // получаем массив ключей блоков, для которых есть комментарии в json
    let commentedBlocksId: string[] = [];
    for (const [key, comment] of Object.entries(sprite.comments)) {
        commentedBlocksId.push(comment.blockId);
    }

    // получаем массив ключей блоков
    const blockKeys = Array.from(Object.keys(sprite.blocks));

    // фильтруем комментарии, оставляя только те, что прикреплены к существующим блокам
    const usedComments = commentedBlocksId.filter((key) => {
        return blockKeys.includes(key);
    });

    // если отфильтрованный массив не пустой, комментарии есть
    parsedSprite.comments = usedComments.length > 0;

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
        comments: false,
        coords: [],
    };

    // заготовка итогового проекта
    let project: Project = {
        broadcasts: [],
        stage: s,
        sprites: [],
        allScripts: "",
    };

    // по-ошибке могут загрузить проект из Scratch 2.0
    // такой проект пропускаем
    if ("info" in scratchProject) {
        throw new Error("Загружен проект второй версии.");
    }

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

    // сохраняем все скрипты проекта в одну строку, чтобы использовать её для поиска по регулярным выражениям
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

/**
 * Вычисление медианного значения в массиве чисел
 * @param values массив
 */
function median(values: number[]) {
    values.sort(function (a, b) {
        return a - b;
    });
    var half = Math.floor(values.length / 2);

    if (values.length % 2) return values[half];
    else return (values[half - 1] + values[half]) / 2.0;
}

/**
 * Функция для быстрого получения Scratchblock-кода, когда это возможно
 * @param key ключ
 * @param blocks объект с блоками
 */
export function sbCode(
    key: string,
    blocks: { [p: string]: Block }
): string | null {
    try {
        return toScratchblocks(key, blocks, "en", {
            tab: "  ",
            variableStyle: "always",
        });
    } catch (e) {
        return null;
    }
}

export default parseProject;
