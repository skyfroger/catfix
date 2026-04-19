import react from "react";
import ScratchBlocks from "scratchblocks-react";
import scratchblocks from "scratchblocks";

import be from "scratchblocks/locales/be.json"; // Белорусский
import ru from "scratchblocks/locales/ru.json";
import { useTranslation } from "react-i18next"; // Русский

interface ScratchCodeProps {
    code: string;
    inline?: boolean; // Опциональный проп для определения, является ли код строчным
}

scratchblocks.loadLanguages({ be, ru });

function ScratchCode({ code, inline }: ScratchCodeProps) {
    const { t, i18n } = useTranslation();

    let parsedBlocks;

    try {
        parsedBlocks = scratchblocks.parse(code, {
            languages: Object.keys(scratchblocks.allLanguages),
        });

        parsedBlocks.translate(scratchblocks.allLanguages[i18n.language]);
    } catch (e) {
        return <code>{code}</code>;
    }

    return (
        <ScratchBlocks
            className={inline ? "scratch-blocks__inline" : ""}
            blockStyle="scratch3"
            languages={["en", "be", "ru"]} // Choose which languages to allow
        >
            {parsedBlocks.stringify()}
        </ScratchBlocks>
    );
}

export default ScratchCode;
