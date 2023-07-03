import react from "react";
import ScratchBlocks from "scratchblocks-react";
import scratchblocks from "scratchblocks";

import be from "scratchblocks/locales/be.json"; // Белорусский
import ru from "scratchblocks/locales/ru.json";
import { useTranslation } from "react-i18next"; // Русский

interface ScratchCodeProps {
    code: string;
}

scratchblocks.loadLanguages({ be, ru });

function ScratchCode({ code }: ScratchCodeProps) {
    const { t, i18n } = useTranslation();
    let parsedBlocks = scratchblocks.parse(code, {
        languages: Object.keys(scratchblocks.allLanguages),
    });

    parsedBlocks.translate(scratchblocks.allLanguages[i18n.language]);

    return (
        <ScratchBlocks
            blockStyle="scratch3"
            languages={["en", "be", "ru"]} // Choose which languages to allow
        >
            {parsedBlocks.stringify()}
        </ScratchBlocks>
    );
}

export default ScratchCode;
