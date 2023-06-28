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
    const [grades, setGrades] = useState<Map<categories, gradesEnum>>(
        new Map()
    );

    const { t } = useTranslation();

    useEffect(() => {
        if (project) {
            const grades: Map<categories, gradesEnum> = grader(project);
            setGrades(grades);
            console.log(grades);
            console.log(project.allScripts);
        }
    }, [project]);

    const gradeKeys = Array.from(grades.keys());
    return (
        <div>
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
