/**
 * Компонент выводит количество ошибок и предупреждений
 */

import react from "react";
import { WarningFilled, BugFilled } from "@ant-design/icons";
import { Tip } from "../../scaners/types";

interface tipsCountProps {
    tips: Tip[];
}

function TipsCount({ tips }: tipsCountProps) {
    const bugsNumber = tips.filter((tip) => tip.type === "error").length;

    const warningsNumber = tips.length - bugsNumber;

    return (
        <>
            {bugsNumber !== 0 && (
                <span>
                    <BugFilled style={{ color: "#FF6D60" }} /> {bugsNumber}
                </span>
            )}{" "}
            {warningsNumber !== 0 && (
                <span>
                    <WarningFilled style={{ color: "#F7D060" }} />{" "}
                    {warningsNumber}
                </span>
            )}
        </>
    );
}

export default TipsCount;
