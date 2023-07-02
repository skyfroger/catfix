/**
 * Вывод списка оценок проекта по ряду критериев.
 */

import React, { useEffect, useState } from "react";
import { FileOutlined, TrophyOutlined } from "@ant-design/icons";
import { Project } from "../../@types/parsedProject";
import grader, { categories, gradesEnum } from "../graders";
import { useTranslation } from "react-i18next";
import GradeItem from "./GradeItem";
import { Card } from "antd";

interface gradesListProps {
    fileName: string | null;
    project: Project | null;
}

function GradesList({ project, fileName }: gradesListProps) {
    const { t } = useTranslation();

    let grades: Map<categories, gradesEnum> = new Map();
    if (project) {
        grades = grader(project);
        console.log(grades);
        console.log(project.allScripts);
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
            {fileName && (
                <h1>
                    <FileOutlined /> {t("ui.fileName", { fileName: fileName })}
                </h1>
            )}
            {project && (
                <h2>
                    <TrophyOutlined />{" "}
                    {t("ui.totalGrade", {
                        totalGrade: totalGrade,
                        maxGrade: 28,
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
