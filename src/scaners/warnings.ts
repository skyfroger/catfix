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
                message: "warning.emptySprite",
            });
        }
    });

    return result;
};

export const unusedVariables: tipFunctionInterface = (project, projectJSON) => {
    let result: Tip[] = [];

    project.stage.localVars.forEach((v) => {
        const varRE = new RegExp(
            `[^to ]\\(${v}::variables\\)|change \\[(.)+\\]`
        );

        if (!varRE.test(project.allScripts)) {
            result.push({
                code: null,
                payload: { variable: v, target: project.stage.name },
                type: "warning",
                message: "warning.unusedVariable",
            });
        }
    });

    project.sprites.forEach((sp) => {
        sp.localVars.forEach((v) => {
            const varRE = new RegExp(
                `[^to ]\\(${v}::variables\\)|change \\[(.)+\\]`
            );
            if (!varRE.test(sp.allScripts)) {
                result.push({
                    code: null,
                    payload: { variable: v, target: sp.name },
                    type: "warning",
                    message: "warning.unusedVariable",
                });
            }
        });
    });

    return result;
};
