/**
 * Описание типов для полей проекта после парсинга JSON
 */

export type Sprite = {
    name: string;
    scripts: string[];
    allScripts: string;
    customBlocks: string[];
    localVars: string[];
    localLists: string[];
};

export type Project = {
    sprites: Sprite[];
    stage: Sprite;
    broadcasts: string[];
    allScripts: string;
};
