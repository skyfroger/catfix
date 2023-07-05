/**
 * Набор функций которые находят предупреждения (warnings)
 */
import { Tip, tipFunctionInterface } from "./types";
import { escapeSB } from "../utils";

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
