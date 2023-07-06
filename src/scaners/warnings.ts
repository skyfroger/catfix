/**
 * Набор функций которые находят предупреждения (warnings)
 */
import { Tip, tipFunctionInterface } from "./types";
import { escapeSB } from "../utils";
import { HAT_BLOCKS } from "../utils";
import { toScratchblocks } from "parse-sb3-blocks/dist/parse-sb3-blocks.module";
import { Block, Target } from "../../@types/scratch";

// заголовочные блоки
// opcode procedures_definition - блок определения функции
const HATS = [...HAT_BLOCKS, "procedures_definition"];

/**
 * Поиск пустых спрайтов
 * @param project
 * @param projectJSON
 */
export const emptySprite: tipFunctionInterface = (project, projectJSON) => {
    let result: Tip[] = [];

    project.sprites.forEach((sp) => {
        if (sp.scripts.length === 0) {
            result.push({
                code: null,
                payload: { spriteName: sp.name },
                type: "warning",
                title: "warning.emptySpriteTitle",
                message: "warning.emptySprite",
            });
        }
    });

    return result;
};

/**
 * Поиск спрайтов в которых нет комментариев
 * @param project
 * @param projectJSON
 */
export const noComments: tipFunctionInterface = (project, projectJSON) => {
    let result: Tip[] = [];

    // сначала проверяем сцену...
    // если на сцене есть скрипты, но нет ни одного комментария
    if (project.stage.scripts.length !== 0 && !project.stage.comments) {
        result.push({
            code: null,
            payload: { target: project.stage.name },
            type: "warning",
            title: "warning.noCommentsTitle",
            message: "warning.noComments",
        });
    }

    // потом спрайты
    project.sprites.forEach((sp) => {
        if (sp.scripts.length !== 0 && !sp.comments) {
            result.push({
                code: null,
                payload: { target: sp.name },
                type: "warning",
                title: "warning.noCommentsTitle",
                message: "warning.noComments",
            });
        }
    });

    return result;
};

/**
 * Поиск переменных, которые не используются
 * @param project
 * @param projectJSON
 */
export const unusedVariables: tipFunctionInterface = (project, projectJSON) => {
    let result: Tip[] = [];

    // Перебираем глобальные переменные, которые хранятся в сцене
    project.stage.localVars.forEach((v) => {
        const escV = escapeSB(v); // "избегаем" специальные символы

        // если переменная не встречается ни в одном из подходящих блоков
        // добавляем замечание
        if (
            !project.allScripts.includes(`set [${escV} v] to`) &&
            !project.allScripts.includes(`change [${escV} v]`) &&
            !project.allScripts.includes(`(${escV}::variables)`) &&
            !project.allScripts.includes(
                `([${escV} v] of [${project.stage.name} v]::sensing)`
            )
        ) {
            result.push({
                code: `(${escapeSB(v, false)}::variable)`,
                payload: { variable: v, target: project.stage.name },
                type: "warning",
                title: "warning.unusedVariableTitle",
                message: "warning.unusedVariable",
            });
        }
    });

    // перебираем локальные переменные
    project.sprites.forEach((sp) => {
        sp.localVars.forEach((v) => {
            const escV = escapeSB(v); // "избегаем" специальные символы

            // если переменная не встречается ни в одном из подходящих блоков
            // добавляем замечание
            if (
                !sp.allScripts.includes(`set [${escV} v] to`) &&
                !sp.allScripts.includes(`change [${escV} v]`) &&
                !sp.allScripts.includes(`(${escV}::variables)`) &&
                !project.allScripts.includes(
                    `([${escV} v] of [${sp.name} v]::sensing)`
                )
            ) {
                result.push({
                    code: `(${escapeSB(v, false)}::variable)`,
                    payload: { variable: v, target: sp.name },
                    type: "warning",
                    title: "warning.unusedVariableTitle",
                    message: "warning.unusedVariable",
                });
            }
        });
    });

    return result;
};

/**
 * Поиск потерянного кода
 * @param project
 * @param projectJSON
 */
export const lostCode: tipFunctionInterface = (project, projectJSON) => {
    let result: Tip[] = [];

    // перебираем все спрайты проекта
    projectJSON.targets.forEach((target) => {
        const tip = findLostBlocks(target);
        if (tip) result.push(tip);
    });

    return result;
};

/**
 * Поиск потерянного кода
 * @param sp спрайт для поиска
 */
function findLostBlocks(sp: Target): Tip | null {
    const blocks = sp.blocks; // объект с блоками
    try {
        // перебираем все блоки по их ключам
        for (const [key, block] of Object.entries(blocks)) {
            // сразу пропускаем shadow-блоки
            if (block.shadow) {
                continue;
            }

            // если блок - Шляпа под которой нет блоков - потерянный блок
            if (HATS.includes(block.opcode) && block.next === null) {
                const script = sbCode(key, blocks);
                return {
                    code: script,
                    payload: { target: sp.name },
                    type: "warning",
                    title: "warning.lostCodeTitle",
                    message: "warning.lostCode",
                };
            }

            // если в блоке нет ссылки на предыдущий и на следующий блок
            if (block.next === null && block.parent === null) {
                const script = sbCode(key, blocks);
                return {
                    code: script,
                    payload: { target: sp.name },
                    type: "warning",
                    title: "warning.lostCodeTitle",
                    message: "warning.lostCode",
                };
            }

            // движемся от текущего блока вверх по ссылкам
            // если не придём к hat-блоку, значит нашли потеряшек
            let blockId: string | undefined = key;
            let lastBlockId: string | undefined = key;
            let opCode = "";
            do {
                opCode = blocks[blockId ?? ""]?.opcode;
                lastBlockId = blockId;
                blockId = blocks[blockId ?? ""]?.parent;
            } while (blockId);

            if (!HATS.includes(opCode)) {
                const script = sbCode(lastBlockId, blocks);
                return {
                    code: script,
                    payload: { target: sp.name },
                    type: "warning",
                    title: "warning.lostCodeTitle",
                    message: "warning.lostCode",
                };
            }
        }
    } catch (e) {
        console.error(e);
    }
    return null;
}

/**
 * Функция для быстрого получения Scratchblock-кода, когда это возможно
 * @param key ключ
 * @param blocks объект с блоками
 */
function sbCode(key: string, blocks: { [p: string]: Block }): string | null {
    try {
        return toScratchblocks(key, blocks, "en", {
            tab: "  ",
            variableStyle: "always",
        });
    } catch (e) {
        return null;
    }
}
