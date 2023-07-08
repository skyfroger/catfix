/**
 * Вывод списка оценок проекта по ряду критериев.
 */

import React from "react";
import { TrophyOutlined } from "@ant-design/icons";
import { Project } from "../../@types/parsedProject";
import grader, { categories, gradesEnum } from "../graders";
import { useTranslation } from "react-i18next";
import GradeItem from "./GradeItem";
import { Card, Empty } from "antd";

interface gradesListProps {
    project: Project | null;
}

function GradesList({ project }: gradesListProps) {
    const { t } = useTranslation();

    let grades: Map<categories, gradesEnum> = new Map();
    if (project) {
        grades = grader(project);
    }

    const gradeKeys = Array.from(grades.keys());

    // суммарная оценка
    const totalGrade = Array.from(grades.values()).reduce(
        (previousValue, currentValue, currentIndex, array) => {
            return previousValue + currentValue;
        },
        0
    );

    return (
        <Card>
            {!project && <Empty description={<p>{t("ui.noGrade")}</p>}></Empty>}

            {project && (
                <h2>
                    <TrophyOutlined />{" "}
                    {t("ui.totalGrade", {
                        totalGrade: totalGrade,
                        maxGrade: 21,
                    })}
                </h2>
            )}
            {project &&
                gradeKeys.map((category, index) => (
                    <GradeItem
                        key={category}
                        category={category}
                        grade={grades.get(category) ?? gradesEnum.zero}
                    />
                ))}
        </Card>
    );
}

export default GradesList;
