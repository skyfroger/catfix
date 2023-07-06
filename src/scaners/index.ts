import { Project } from "../../@types/parsedProject";
import { ScratchProject } from "../../@types/scratch";
import { Tip, tipFunctionInterface } from "./types";

// импорт функций сканирования
import {
    lostCode,
    emptySprite,
    unusedVariables,
    noComments,
    scriptsOverlap,
} from "./warnings";
import { messageNeverReceived } from "./errors";

// в этой переменной хранится массив функций, которые отвечают
// за получения списка предупреждений
const warningFunctions = [
    lostCode,
    unusedVariables,
    scriptsOverlap,
    noComments,
    emptySprite,
];

// храним функции для поиска ошибок
const errorFunctions = [messageNeverReceived];

/**
 * Функция перебирает передаваемый в неё массив функций,
 * которые ищут предупреждения и ошибки в коде
 * @param project
 * @param projectJSON
 * @param tipFunctions
 */
const scanForTips = (
    project: Project,
    projectJSON: ScratchProject,
    tipFunctions: tipFunctionInterface[]
): Tip[] => {
    let result: Tip[] = [];
    tipFunctions.forEach((fn) => {
        result.push(...fn(project, projectJSON));
    });
    return result;
};

export const scanForWarnings = (
    project: Project,
    projectJSON: ScratchProject
) => {
    return scanForTips(project, projectJSON, warningFunctions);
};

export const scanForErrors = (
    project: Project,
    projectJSON: ScratchProject
) => {
    return scanForTips(project, projectJSON, errorFunctions);
};
