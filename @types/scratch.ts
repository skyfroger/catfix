type JSONValue =
    | string
    | number
    | boolean
    | undefined
    | { [x: string]: JSONValue }
    | Array<JSONValue>;

type Monitor = {
    id: string,
    mode: string,
    opcode: string,
    params: JSONValue,
    spriteName?: string,
    value: number,
    width: number,
    height: number,
    x: number,
    y: number,
    visible: boolean,
    sliderMin: number,
    sliderMax: number
}

type Block = {
    opcode: string,
    next?: string,
    parent?: string,
    inputs: JSONValue,
    fields: JSONValue,
    shadow: boolean,
    topLevel: boolean,
    x?: number,
    y?: number
}

export type Target = {
    isStage: boolean,
    name: string,
    variables: JSONValue,
    lists: JSONValue,
    broadcasts: JSONValue,
    blocks: {[key: string]: Block},
    comments: JSONValue,
    currentCostume: number,
    costumes: JSONValue,
    sounds: JSONValue,
    volume: number,
    layerOrder: number,
    tempo: number,
    videoTransparency?: number,
    videoState: string,
    textToSpeechLanguage: string
}

export type ScratchProject = {
    targets: Target[],
    monitors: Monitor[],
    extensions: string[],
    meta: {
        semver: string,
        vm: string,
        agent: string
    }
}
