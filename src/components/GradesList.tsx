/**
 * Вывод списка оценок проекта по ряду критериев.
 */

import React, { useEffect, useState } from "react";
import { Project } from "../../@types/parsedProject";
import grader, { categories, gradesEnum } from "../graders";
import { useTranslation } from "react-i18next";
import GradeItem from "./GradeItem";

interface gradesListProps {
    project: Project | null;
}

function GradesList({ project }: gradesListProps) {
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
        <div>
            {project && <h1>{t("totalGrade", { totalGrade: totalGrade })}</h1>}
            {project &&
                gradeKeys.map((category, index) => (
                    <GradeItem
                        key={category}
                        category={category}
                        grade={grades.get(category) ?? gradesEnum.zero}
                    />
                ))}
        </div>
    );
}

export default GradesList;
