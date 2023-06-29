// поиск бесконечного цикла
export const foreverLoopRE = new RegExp("forever\\n(.+\\n)+end");

// поиск цикла с определённым количеством повторений
export const countLoopRE = new RegExp("repeat \\((.+)\\)\\n(.+\\n)+end");

// поиск цикла с предусловием
export const untilLoopRE = new RegExp("repeat until \\<(.+)\\>\\n(.+\\n)+end");

// поиск блока если ... то
export const ifThenRE = new RegExp("if \\<(.+)\\> then\\n(.+\\n)+end");

// поиска блока если ... то ... иначе
export const ifThenElseRE = new RegExp(
    "if \\<(.+)\\> then\\n(.+\\n)+else\\n(.+\\n)+end"
);

// поиск составных условий с and, or и not
export const compConditionsRE = new RegExp("<(.)+> (and|or) <(.)+>|<not (.)+>");

// инициализация переменных
export const setVarsRE = new RegExp("set \\[(.)+\\] to ");

// поиск переменных в числовых слотах, которые используются в скриптах
// также ищем блок Изменить [переменная] на
export const roundVarsRE = new RegExp(
    "[^to ]\\((.)+::variables\\)|change \\[(.)+\\]"
);
