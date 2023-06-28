import { Project, Sprite } from "../../@types/parsedProject";
import {
    compConditionsRE,
    countLoopRE,
    foreverLoopRE,
    ifThenElseRE,
    ifThenRE,
    roundVarsRE,
    setVarsRE,
    untilLoopRE,
} from "./searchPatterns";

/*
Интерфейс для описания типа оценки
 */

// список названий категорий оценивания
export type categories = "flow" | "data" | "logic";

// список возможных оценок
export enum gradesEnum {
    zero = 0,
    one = 1,
    two = 2,
    three = 3,
}

function flowGrader(project: Project): gradesEnum {
    /**
     * Поток выполнения: только следование или использование различных циклов.
     */
    let g: gradesEnum = gradesEnum.zero;

    // считаем количество скриптов в спрайтах проекта
    const scriptsCount = project.sprites.reduce(
        (previousValue, currentSprite) => {
            return previousValue + currentSprite.scripts.length;
        },
        0
    );

    // даём 1 балл, если есть хотя бы 1 скрипт на сцене или в спрайте
    if (project.stage.scripts.length > 0 || scriptsCount > 0) {
        g = gradesEnum.one;
    }

    // даём 2 балла, если есть бесконечный цикл или счётный цикл
    if (
        foreverLoopRE.test(project.allScripts) ||
        countLoopRE.test(project.allScripts)
    ) {
        g = gradesEnum.two;
    }

    // даём 3 балла, если есть цикл с предусловием
    if (untilLoopRE.test(project.allScripts)) {
        g = gradesEnum.three;
    }

    return g;
}

function dataRepresentationGrader(project: Project): gradesEnum {
    /**
     * Представление данных: использование переменных и списков
     */
    let g: gradesEnum = gradesEnum.zero;

    // даём 1 балл, если в блоках используются только числа-литералы
    if (new RegExp("\\(\\d+\\)").test(project.allScripts)) {
        g = gradesEnum.one;
    }

    // даём 2 балл, если переменной задаётся начальное значение и переменные есть в блоках скрипта
    if (
        setVarsRE.test(project.allScripts) &&
        roundVarsRE.test(project.allScripts)
    ) {
        g = gradesEnum.two;
    }

    // даём 3 балла, если в скриптах есть списки
    if (new RegExp("\\((.)+::list\\)").test(project.allScripts)) {
        g = gradesEnum.three;
    }
    return g;
}

function logicGrader(project: Project): gradesEnum {
    /**
     * Логика: условные операторы и составные условия
     */
    let g: gradesEnum = gradesEnum.zero;

    // даём 1 балл, если есть оператор если ... то
    if (ifThenRE.test(project.allScripts)) {
        g = gradesEnum.one;
    }

    // даём 2 балла, если есть оператор если ... то ... иначе
    if (ifThenElseRE.test(project.allScripts)) {
        g = gradesEnum.two;
    }

    // даём 3 балла за составные условия
    // todo нужно проверять не пустые ли блоки, в которых встречаются составные условия
    if (compConditionsRE.test(project.allScripts)) {
        g = gradesEnum.three;
    }

    return g;
}

function grader(project: Project): Map<categories, gradesEnum> {
    /**
     * Функция-агрегатор результатов оценивания по разным критериям
     */
    let res: Map<categories, gradesEnum> = new Map();

    res.set("flow", flowGrader(project)); // оценка потока выполнения;
    res.set("data", dataRepresentationGrader(project)); // оценка представления данных
    res.set("logic", logicGrader(project)); // оценка использования логических операторов

    return res;
}

export default grader;
