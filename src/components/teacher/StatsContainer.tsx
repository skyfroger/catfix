import react, { useEffect, useState } from "react";
import { APIResponce } from "../../utils/httpAPI";
import { TableData } from "./ProjectsDataTable";
import { useTranslation } from "react-i18next";
import { Card, Col, Row, Space } from "antd";
import { Chart } from "react-google-charts";

interface statsContainerProps {
    projects: APIResponce[];
    tableData: TableData[];
}

function StatsContainer({ projects, tableData }: statsContainerProps) {
    const [warnGraphData, setWarnGraphData] = useState<string | number[][]>([
        [],
    ]);
    const [errGraphData, setErrGraphData] = useState<string | number[][]>([[]]);

    const { t } = useTranslation();

    // пересчитываем данные для графиков, если добавили/удалили проект или сменили язык
    useEffect(() => {
        // считаем общее количество спрайтов
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

        // данные для графика с предупреждениями
        const warnData = [
            ["hi", ""],
            ...sortedWarnings.map((warn) => [t(warn[0] as any), warn[1]]),
        ];

        // данные для графика с ошибками
        const errData = [
            ["hi", ""],
            ...sortedErrors.map((err) => [t(err[0] as any), err[1]]),
        ];

        setWarnGraphData(warnData);
        setErrGraphData(errData);
    }, [tableData, t]);

    const warnOptions = {
        title: t("plots.warnTitle"),
        chartArea: { width: "50%" },
        hAxis: {
            title: t("plots.xAxis"),
            minValue: 0,
        },
        vAxis: {
            title: t("plots.yAxis"),
        },
        animation: {
            duration: 1000,
            easing: "out",
            startup: true,
        },
        colors: ["#F7D060"],
    };

    const errOptions = {
        title: t("plots.errTitle"),
        chartArea: { width: "50%" },
        hAxis: {
            title: t("plots.xAxis"),
            minValue: 0,
        },
        vAxis: {
            title: t("plots.yAxis"),
        },
        animation: {
            duration: 1000,
            easing: "out",
            startup: true,
        },
        colors: ["#FF6D60"],
    };

    return (
        <>
            <Row gutter={16}>
                <Col sm={24} lg={12}>
                    <Card
                        title={t("plots.warnCardTitle")}
                    >
                        {warnGraphData.length > 1 && (
                            <Chart
                                chartType="BarChart"
                                width="100%"
                                height="400px"
                                data={warnGraphData}
                                options={warnOptions}
                            />
                        )}
                    </Card>
                </Col>
                <Col sm={24} lg={12}>
                    <Card title={t("plots.errCardTitle")}>
                        {errGraphData.length > 1 && (
                            <Chart
                                chartType="BarChart"
                                width="100%"
                                height="400px"
                                data={errGraphData}
                                options={errOptions}
                            />
                        )}
                    </Card>
                </Col>
            </Row>
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
