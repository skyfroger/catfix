import { escapeSB, sbCode } from "../utils";

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
            (stageScripts.includes(`broadcast [${escapeSB(br)} v]`) ||
                stageScripts.includes(
                    `broadcast [${escapeSB(br)} v] and wait`
                )) &&
            !project.allScripts.includes(`when I receive [${escapeSB(br)} v]`)
        ) {
            const codeExample = `broadcast [${escapeSB(
                br
            )} v]\nbroadcast [${escapeSB(br)}  v] and wait`;
            result.push({
                code: codeExample,
                payload: { target: project.stage.name, broadcast: br },
                type: "error",
                title: "error.messageNeverReceivedTitle",
                message: "error.messageNeverReceived",
            });
        }
    });

    // проверяем сообщения, отправляемые спрайтами
    project.sprites.forEach((sp) => {
        project.broadcasts.forEach((br) => {
            const spriteScripts = sp.allScripts;
            if (
                (spriteScripts.includes(`broadcast [${escapeSB(br)} v]`) ||
                    spriteScripts.includes(
                        `broadcast [${escapeSB(br)} v] and wait`
                    )) &&
                !project.allScripts.includes(
                    `when I receive [${escapeSB(br)} v]`
                )
            ) {
                const codeExample = `broadcast [${escapeSB(
                    br
                )} v]\nbroadcast [${escapeSB(br)}  v] and wait`;
                result.push({
                    code: codeExample,
                    payload: { target: sp.name, broadcast: br },
                    type: "error",
                    title: "error.messageNeverReceivedTitle",
                    message: "error.messageNeverReceived",
                });
            }
        });
    });

    return result;
};

/**
 * Поиск переменных, которые используются без инициализации
 * @param project
 * @param projectJSON
 */
export const varWithoutInit: tipFunctionInterface = (project, projectJSON) => {
    let result: Tip[] = [];
    // Перебираем глобальные переменные, которые хранятся в сцене
    project.stage.localVars.forEach((v) => {
        const escV = escapeSB(v); // "избегаем" специальные символы

        // если нет блока set to, а другие блоки использующие переменную есть,
        // генерируем ошибку
        if (
            !project.allScripts.includes(`set [${escV} v] to`) &&
            (project.allScripts.includes(`change [${escV} v]`) ||
                project.allScripts.includes(`(${escV}::variables)`) ||
                project.allScripts.includes(
                    `([${escV} v] of [${project.stage.name} v]::sensing)`
                ))
        ) {
            result.push({
                code: `(${escapeSB(v, false)}::variable)\nset [${escapeSB(
                    v,
                    false
                )} v] to [0]`,
                payload: { variable: v, target: project.stage.name },
                type: "error",
                title: "error.varWithoutInitTitle",
                message: "error.varWithoutInit",
            });
        }
    });

    // перебираем локальные переменные
    project.sprites.forEach((sp) => {
        sp.localVars.forEach((v) => {
            const escV = escapeSB(v); // "избегаем" специальные символы

            // если нет блока set to, а другие блоки использующие переменную есть,
            // генерируем ошибку
            if (
                !sp.allScripts.includes(`set [${escV} v] to`) &&
                (sp.allScripts.includes(`change [${escV} v]`) ||
                    sp.allScripts.includes(`(${escV}::variables)`) ||
                    project.allScripts.includes(
                        `([${escV} v] of [${sp.name} v]::sensing)`
                    ))
            ) {
                result.push({
                    code: `(${escapeSB(v, false)}::variable)\nset [${escapeSB(
                        v,
                        false
                    )} v] to [0]`,
                    payload: { variable: v, target: sp.name },
                    type: "error",
                    title: "error.varWithoutInitTitle",
                    message: "error.varWithoutInit",
                });
            }
        });
    });
    return result;
};

/**
 * Поиск сообщений которые принимаются, но не отправляются
 * @param project
 * @param projectJSON
 */
export const messageNeverSent: tipFunctionInterface = (
    project,
    projectJSON
) => {
    let result: Tip[] = [];

    // проверяем сообщения отправляемые сценой
    project.broadcasts.forEach((br) => {
        if (
            !(
                project.allScripts.includes(`broadcast [${escapeSB(br)} v]`) ||
                project.allScripts.includes(
                    `broadcast [${escapeSB(br)} v] and wait`
                )
            ) &&
            project.stage.allScripts.includes(
                `when I receive [${escapeSB(br)} v]`
            )
        ) {
            const codeExample = `when I receive [${escapeSB(br)} v]`;
            result.push({
                code: codeExample,
                payload: { target: project.stage.name, broadcast: br },
                type: "error",
                title: "error.messageNeverSentTitle",
                message: "error.messageNeverSent",
            });
        }
    });

    // проверяем сообщения, отправляемые спрайтами
    project.sprites.forEach((sp) => {
        project.broadcasts.forEach((br) => {
            const spriteScripts = sp.allScripts;
            if (
                !(
                    project.allScripts.includes(
                        `broadcast [${escapeSB(br)} v]`
                    ) ||
                    project.allScripts.includes(
                        `broadcast [${escapeSB(br)} v] and wait`
                    )
                ) &&
                sp.allScripts.includes(`when I receive [${escapeSB(br)} v]`)
            ) {
                const codeExample = `when I receive [${escapeSB(br)} v]`;
                result.push({
                    code: codeExample,
                    payload: { target: sp.name, broadcast: br },
                    type: "error",
                    title: "error.messageNeverSentTitle",
                    message: "error.messageNeverSent",
                });
            }
        });
    });

    return result;
};
