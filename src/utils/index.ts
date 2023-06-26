/**
 * Вспомогательные функции для парсинга проекта
 */

import {Project, Sprite} from "../../@types/parsedProject";
import {ScratchProject, Target} from "../../@types/scratch";

import { toScratchblocks } from "parse-sb3-blocks/dist/parse-sb3-blocks.module";

// список кодов для блоков-тригеров
const HAT_BLOCKS = [
    'event_whenflagclicked',
    'event_whenkeypressed',
    'event_whengreaterthan',
    'event_whenthisspriteclicked',
    'event_whenstageclicked',
    'event_whenbackdropswitchesto',
    'event_whenbroadcastreceived',
    'control_start_as_clone',
    'procedures_definition',
    'boost_whenColor',
    'boost_whenTilted',
    'ev3_whenButtonPressed',
    'ev3_whenDistanceLessThan',
    'ev3_whenBrightnessLessThan',
    'gdxfor_whenGesture',
    'gdxfor_whenForcePushedOrPulled',
    'gdxfor_whenTilted',
    'makeymakey_whenMakeyKeyPressed',
    'makeymakey_whenCodePressed',
    'microbit_whenButtonPressed',
    'microbit_whenGesture',
    'microbit_whenTilted',
    'microbit_whenPinConnected',
    'wedo2_whenDistance',
    'wedo2_whenTilted',
];

// код блока с названием процедуры пользователя
const PROCEDURES_PROTOTYPE = 'procedures_prototype';

function parseTarget(sprite: Target): Sprite {
    /**
     * Парсинг полей отдельного спрайта
     */

    // заготовка спрайта
    let parsedSprite: Sprite = {
        name: '',
        scripts: [],
        customBlocks: [],
        localVars: [],
        localLists: []
    }

    // сохраняем имя спрайта
    parsedSprite.name = sprite.name;

    // сохраняем имена локальных переменных
    for (const key in sprite.variables){
        parsedSprite.localVars.push(String(sprite.variables[key][0]))
    }

    // сохраняем имена локальных списков
    for (const key in sprite.lists){
        parsedSprite.localLists.push(String(sprite.lists[key][0]))
    }

    // список id стартовых блоков спрайта
    const spriteCapIDs = Object.keys(sprite.blocks).filter(
        (key) => HAT_BLOCKS.includes(sprite.blocks[key].opcode)
    );

    // получаем и сохраняем список имён блоков, описанных пользователем
    const customBlockIDs: string[] = Object.keys(sprite.blocks).filter(
        (key) => sprite.blocks[key].opcode === PROCEDURES_PROTOTYPE
    );
    customBlockIDs.forEach((id:string) => {
        parsedSprite.customBlocks.push(sprite.blocks[id].mutation.proccode);
    })

    // сохраняем валидные скрипты спрайта (единичный блок-шапка не будет валидным скриптом)
    spriteCapIDs.forEach((hat)=> {

        // получаем удобочитаемый текст скрипта
        const script: string = toScratchblocks(hat, sprite.blocks, "en", {
            tab: "  ",
            variableStyle: "always"
        });

        // если в результате получилась только одна строка, то в скрипте только один блок
        // такой скрипт не считается валидным
        if (script.includes("\n")) {
            parsedSprite.scripts.push(script);
        }
    })

    return parsedSprite;
}

function parseProject(scratchProject: ScratchProject): Project {
    /**
     * Парсинг полей проекта
     */

    // заготовка итогового проекта
    let project: Project = {
        broadcasts: [],
        stage: undefined,
        sprites: []
    };

    // парсим сцену проекта
    const stage = scratchProject.targets.filter((t: Target) => t.isStage)[0];
    project.stage = parseTarget(stage);

    // парсим спрайты проекта
    const targets: Target[] = scratchProject.targets.filter((t: Target) => !t.isStage);
    targets.forEach((t: Target) => {
        project.sprites.push(parseTarget(t));
    })

    // получаем список передаваемых сообщений
    project.broadcasts = Object.values(stage.broadcasts);

    return project;
}

export default parseProject;