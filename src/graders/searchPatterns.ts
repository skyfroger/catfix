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
    "[^to ]\\((.)+::variables\\)|change \\[(.)+\\] by \\(.+\\)"
);

// поиск скриптов, которые запускаются по нажатию на клавишу
// с помощью группы получаем клавиши
export const scriptsWithKeyPressEvent = new RegExp(
    "when \\[(.+ v)\\] key pressed::event",
    "g"
);

// поиск создания клонов спрайта
export const cloneSpriteRE = new RegExp("create clone of \\[(.)+ v\\]\\n");

// поиск блока ждать n секунд
export const waitSecondsRE = new RegExp("wait \\(.+\\) seconds\\n");

// синхронизация через ожидание или смену фона
export const waitCondAndBackdropRE = new RegExp(
    "wait until <.+>\\n|when backdrop switches to \\[.+\\]\\n"
);

// все блоки связанные с мышью
export const mouseInteractionRE = new RegExp(
    "go to \\[mouse-pointer v\\]\\n|glide \\(.+\\) secs to \\[mouse-pointer v\\]\\n|point towards \\[mouse-pointer v\\]\\n|<touching \\[mouse-pointer v\\]\\?>|\\(distance to \\[mouse-pointer v\\]\\)|\\(mouse [xy]\\)|<mouse down\\?>"
);

// все блоки для работы с видео
export const videoInteractionRE = new RegExp(
    "when video motion \\\\> \\(.+\\)\\n|turn video \\[.+\\]\\n|set video transparency to \\(.+\\)\\n|\\(video \\[.+ v\\] on \\[.+ v\\]\\)"
);
