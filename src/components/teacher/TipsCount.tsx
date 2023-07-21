/**
 * Компонент выводит количество ошибок и предупреждений
 */

import react from "react";
import { WarningFilled, BugFilled } from "@ant-design/icons";
import { Tip } from "../../scaners/types";
import TipsSummary from "../tips/TipsSummary";
import React from "react";
import { Popover } from "antd";

interface tipsCountProps {
    tips: Tip[];
}

function TipsCount({ tips }: tipsCountProps) {
    const bugsNumber = tips.filter((tip) => tip.type === "error").length;

    const warningsNumber = tips.length - bugsNumber;

    return (
        <>
            <Popover
                placement="bottomRight"
                content={<TipsSummary tips={tips} />}
            >
                <span style={{ cursor: "help" }}>
                    {bugsNumber !== 0 && (
                        <span>
                            <BugFilled style={{ color: "#FF6D60" }} />{" "}
                            {bugsNumber}
                        </span>
                    )}{" "}
                    {warningsNumber !== 0 && (
                        <span>
                            <WarningFilled style={{ color: "#F7D060" }} />{" "}
                            {warningsNumber}
                        </span>
                    )}
                </span>
            </Popover>
        </>
    );
}

export default TipsCount;
