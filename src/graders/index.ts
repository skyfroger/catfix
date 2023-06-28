import { Project, Sprite } from "../../@types/parsedProject";
import { countLoopRE, foreverLoopRE, untilLoopRE } from "./searchPatterns";

/*
Интерфейс для описания типа оценки
 */

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
    let g: gradesEnum = 0;

    // считаем количество скриптов в спрайтах проекта
    const scriptsCount = project.sprites.reduce(
        (previousValue, currentSprite) => {
            return previousValue + currentSprite.scripts.length;
        },
        0
    );

    // даём 1 балл, если есть хотя бы 1 скрипт на сцене или в спрайте
    if (project.stage.scripts.length > 0 || scriptsCount > 0) {
        g = 1;
    }

    // даём 2 балла, если есть бесконечный цикл или счётный цикл
    if (
        foreverLoopRE.test(project.allScripts) ||
        countLoopRE.test(project.allScripts)
    ) {
        g = 2;
    }

    // даём 3 балла, если есть цикл с предусловием
    if (untilLoopRE.test(project.allScripts)) {
        g = 3;
    }

    // TODO регулярное выражение для цикла n повторений: repeat \(.+\)\n.+\nend

    return g;
}

function grader(project: Project): Map<string, number> {
    let res: Map<string, number> = new Map();

    res.set("flow", flowGrader(project)); // оценка потока выполнения;

    return res;
}

export default grader;
