// поиск бесконечного цикла
export const foreverLoopRE = new RegExp("forever\\n(.+\\n)+end");

// поиск цикла с определённым количеством повторений
export const countLoopRE = new RegExp("repeat \\((.+)\\)\\n(.+\\n)+end");

// поиск цикла с предусловием
export const untilLoopRE = new RegExp("repeat until \\<(.+)\\>\\n(.+\\n)+end");
