/**
 * Набор функций которые находят ошибки (error)
 */
import { Tip, tipFunctionInterface } from "./types";

/**
 * Ищем сообщения, которые никогда не принимаются
 * @param project
 * @param projectJSON
 */
export const messageNeverReceived: tipFunctionInterface = (
    project,
    projectJSON
) => {
    let result: Tip[] = [];

    // проверяем сообщения отправляемые сценой
    project.broadcasts.forEach((br) => {
        const stageScripts = project.stage.allScripts;
        if (
            (stageScripts.includes(`broadcast [${br} v]`) ||
                stageScripts.includes(`broadcast [${br} v] and wait`)) &&
            !project.allScripts.includes(`when I receive [${br} v]`)
        ) {
            const codeExample = `broadcast [${br} v]\nbroadcast [${br}  v] and wait`;
            result.push({
                code: codeExample,
                payload: { target: project.stage.name, broadcast: br },
                type: "error",
                message: "error.messageNeverReceived",
            });
        }
    });

    // проверяем сообщения, отправляемые спрайтами
    project.sprites.forEach((sp) => {
        project.broadcasts.forEach((br) => {
            const spriteScripts = sp.allScripts;
            if (
                (spriteScripts.includes(`broadcast [${br} v]`) ||
                    spriteScripts.includes(`broadcast [${br} v] and wait`)) &&
                !project.allScripts.includes(`when I receive [${br} v]`)
            ) {
                const codeExample = `broadcast [${br} v]\nbroadcast [${br}  v] and wait`;
                result.push({
                    code: codeExample,
                    payload: { target: sp.name, broadcast: br },
                    type: "error",
                    message: "error.messageNeverReceived",
                });
            }
        });
    });

    return result;
};
