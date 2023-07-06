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
    comments: boolean;
    coords: Array<{ x: number; y: number; w: number; h: number }>;
};

export type Project = {
    sprites: Sprite[];
    stage: Sprite;
    broadcasts: string[];
    allScripts: string;
};
