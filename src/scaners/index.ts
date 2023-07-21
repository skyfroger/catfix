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
    scriptIsTooLong,
    spriteStandardName,
} from "./warnings";
import {
    messageNeverReceived,
    messageNeverSent,
    varWithoutInit,
} from "./errors";

// в этой переменной хранится массив функций, которые отвечают
// за получения списка предупреждений
const warningFunctions = [
    lostCode,
    spriteStandardName,
    unusedVariables,
    scriptsOverlap,
    scriptIsTooLong,
    noComments,
    emptySprite,
];

// храним функции для поиска ошибок
const errorFunctions = [varWithoutInit, messageNeverReceived, messageNeverSent];

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
