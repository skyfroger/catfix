/**
 * Набор функций которые находят предупреждения (warnings)
 */
import { Tip, tipFunctionInterface } from "./types";

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
        const varRE = new RegExp(
            `set \\[${v} v\\] to .+\n|change \\[${v} v\\].+\n|\\(${v}::variable\\)`
        );

        if (!varRE.test(project.allScripts)) {
            result.push({
                code: `(${v}::variable)`,
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
            const varRE = new RegExp(
                `set \\[${v} v\\] to .+\n|change \\[${v} v\\].+\n|\\(${v}::variable\\)`
            );
            // Проверяем наличие блока ОТ в других спрайтах
            const varFromSpriteRE = new RegExp(
                `\\(\\[${v} v\\] of \\[${sp.name} v\\]::sensing\\)`
            );
            if (
                !varRE.test(sp.allScripts) &&
                !varFromSpriteRE.test(project.allScripts)
            ) {
                result.push({
                    code: `(${v}::variable)`,
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
