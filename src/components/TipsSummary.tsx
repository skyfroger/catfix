import react from "react";
import { Tip } from "../scaners/types";
import { useTranslation } from "react-i18next";

interface tipsSummaryProps {
    tips: Tip[];
}

type Summary = { [key: string]: number };

function TipsSummary({ tips }: tipsSummaryProps) {
    const { t } = useTranslation();

    let s: Summary = {};

    tips.forEach((tip) => {
        if (s[tip.title]) {
            s[tip.title] += 1;
        } else {
            s[tip.title] = 1;
        }
    });

    return (
        <div>
            {Object.keys(s).map((key, index) => {
                return (
                    <p key={index}>
                        {t(key as any)}: <strong>{s[key]}</strong>
                    </p>
                );
            })}
        </div>
    );
}

export default TipsSummary;
