import { Project, Sprite } from "../../@types/parsedProject";
import {
    compConditionsRE,
    countLoopRE,
    foreverLoopRE,
    ifThenElseRE,
    ifThenRE,
    roundVarsRE,
    scriptsWithKeyPressEvent,
    setVarsRE,
    untilLoopRE,
} from "./searchPatterns";

/*
Интерфейс для описания типа оценки
 */

// список названий категорий оценивания
export type categories = "flow" | "data" | "logic" | "parallel";

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

    // все переменные-списки в сцене
    const allStageLists = project.stage.localLists.join(" v|");

    // все переменные-списки в спрайтах
    const allSpriteLists = project.sprites.reduce(
        (previousValue, currentValue) => {
            return previousValue + " v|" + currentValue.localLists.join(" v|");
        },
        ""
    );

    // регулярное выражения для поиска переменных-списков в скриптах
    const listsRE = new RegExp(`${allStageLists}${allSpriteLists} v`);

    // количество переменных-списков
    const listsNum =
        project.stage.localLists.length +
        project.sprites.reduce((previousValue, currentValue) => {
            return previousValue + currentValue.localLists.length;
        }, 0);

    // даём 3 балла, если в скриптах есть списки и они используются
    if (
        new RegExp("\\((.)+::list\\)").test(project.allScripts) ||
        (listsNum !== 0 && listsRE.test(project.allScripts))
    ) {
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

function parallelismGrader(project: Project): gradesEnum {
    /**
     * Параллельное выполнение скриптов
     */
    let g: gradesEnum = gradesEnum.zero;

    // считаем, сколько спрайтов содержат скрипт, начинающийся с зелёного флажка
    // todo возможно потом нужно будет учитывать и скрипты на сцене
    const spritesWithGreenFlag = project.sprites.filter((spr) => {
        return spr.allScripts.includes("when @greenFlag clicked");
    });
    if (spritesWithGreenFlag.length > 1) {
        g = gradesEnum.one;
    }

    // ищем спрайты, клик по которым запускает больше одного сприпта
    const spritesWithClicks = project.sprites.filter((spr) => {
        const clk = spr.allScripts.match(/when this sprite clicked/g);
        return clk && clk.length > 1;
    });

    // ищем скрипты, которые запускаются по нажатию на клавишу
    const keyEventMatches = project.allScripts.matchAll(
        scriptsWithKeyPressEvent
    );
    // в множество сохраняем названия клавиш
    const keys = new Set(
        Array.from(keyEventMatches).map((match) => {
            // по индексу 1 будет храниться название клавиши
            return match[1];
        })
    );
    // перебираем все клавиши и считает, сколько сприптов запускаеются по нажатию этой клавиши
    let keyFlag: boolean[] = [];
    keys.forEach((k) => {
        // создаём RE которое содержит название очередной клавиши
        const re = new RegExp(`when \\[${k}\\] key pressed::event`, "g");
        // находим все скрипты стартующие по этой клавише
        const matches = project.allScripts.matchAll(re);
        // сохраняем в массиве keyFlag значение true, если найдено больше 1 скрипта
        keyFlag.push(Array.from(matches).length > 1);
    });

    if (spritesWithClicks.length > 0 || keyFlag.includes(true)) {
        g = gradesEnum.two;
    }

    // даём 3 балла, если одно сообщение запускает больше 1 скрипта
    let broadcastsFlag: boolean[] = [];
    project.broadcasts.forEach((b) => {
        // создаём RE которое содержит название очередного сообщения
        const re = new RegExp(`when I receive \\[${b} v\\]`, "g");
        // находим все скрипты стартующие по этому сообщению
        const matches = project.allScripts.matchAll(re);
        // сохраняем в массиве broadcastsFlag значение true, если найдено больше 1 скрипта
        broadcastsFlag.push(Array.from(matches).length > 1);
    });

    if (broadcastsFlag.includes(true)) {
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
    res.set("parallel", parallelismGrader(project)); // оценка параллелизма

    return res;
}

export default grader;
