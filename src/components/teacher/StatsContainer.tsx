import react, { useEffect } from "react";
import { APIResponce } from "../../utils/httpAPI";
import { TableData } from "./ProjectsDataTable";
import { useTranslation } from "react-i18next";
import { Card, Space } from "antd";

interface statsContainerProps {
    projects: APIResponce[];
    tableData: TableData[];
}

function StatsContainer({ projects, tableData }: statsContainerProps) {
    const { t } = useTranslation();

    const totalNumberOfSprites = projects.reduce((prev, cur) => {
        return prev + cur.projectJSON.targets.length + 1;
    }, 0);

    const warningTitles = countTipsByType(
        tableData,
        "warning",
        totalNumberOfSprites
    );
    const errorTitles = countTipsByType(
        tableData,
        "error",
        totalNumberOfSprites
    );

    const sortedWarnings = Array.from(warningTitles.entries()).sort(
        (a, b) => b[1] - a[1]
    );
    const sortedErrors = Array.from(errorTitles.entries()).sort(
        (a, b) => b[1] - a[1]
    );

    return (
        <>
            <Space
                direction="horizontal"
                style={{
                    width: "100%",
                    justifyContent: "start",
                    alignItems: "start",
                    flexWrap: "wrap",
                }}
            >
                <Card title={"Предупреждения: от более частых к более редким"}>
                    <ol>
                        {sortedWarnings.map((tip, index) => {
                            return <li key={index}>{t(tip[0] as any)}</li>;
                        })}
                    </ol>
                </Card>

                <Card title={"Ошибки: от более частых к более редким"}>
                    <ol>
                        {sortedErrors.map((tip, index) => {
                            return <li key={index}>{t(tip[0] as any)}</li>;
                        })}
                    </ol>
                </Card>
            </Space>
        </>
    );
}

/**
 * Подсчёт количества разных ошибок и замечаний на 1 спрайт
 * @param data входные данные
 * @param type тип совета (error, warning)
 * @param numberOfSprites общее количество спрайтов во всех проектах
 */
function countTipsByType(
    data: TableData[],
    type: "warning" | "error",
    numberOfSprites: number
): Map<string, number> {
    const result = new Map<string, number>();
    data.forEach((proj) => {
        const filteredTips = proj.tips.filter((tip) => tip.type === type);
        filteredTips.forEach((w) => {
            result.set(w.title, (result.get(w.title) ?? 0) + 1);
        });
    });

    result.forEach((value, key) => {
        result.set(key, Number((value / numberOfSprites).toFixed(4)));
    });

    return result;
}

export default StatsContainer;
