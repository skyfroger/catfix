import react from "react";
import { WarningFilled, BugFilled } from "@ant-design/icons";
import { Tip } from "../scaners/types";
import { useTranslation } from "react-i18next";
import React from "react";

interface tipsSummaryProps {
    tips: Tip[];
}

type Summary = { [key: string]: { count: number; type: string } };

function TipsSummary({ tips }: tipsSummaryProps) {
    const { t } = useTranslation();

    let s: Summary = {};

    tips.forEach((tip) => {
        if (s[tip.title]) {
            s[tip.title].count += 1;
        } else {
            s[tip.title] = { type: tip.type, count: 1 };
        }
    });

    return (
        <div>
            {Object.keys(s).map((key, index) => {
                const icon =
                    s[key].type === "warning" ? (
                        <WarningFilled />
                    ) : (
                        <BugFilled />
                    );
                const color = s[key].type === "warning" ? "#F7D060" : "#FF6D60";
                return (
                    <p key={index}>
                        <span style={{ color: color }}>{icon}</span>{" "}
                        {t(key as any)}: <strong>{s[key].count}</strong>
                    </p>
                );
            })}
        </div>
    );
}

export default TipsSummary;
