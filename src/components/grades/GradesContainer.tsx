/**
 * Компонент-контейнер для расчёта оценок
 */

import react, { useEffect } from "react";
import { Project } from "../../../@types/parsedProject";
import { usePostHog } from "posthog-js/react";
import grader, {
    categories,
    getMaxGrade,
    getTotalGrade,
    graderResult,
} from "../../graders";
import GradesList from "./GradesList";

interface gradesContainerProps {
    project: Project | null;
}
function GradesContainer({ project }: gradesContainerProps) {
    const posthog = usePostHog(); // для отправки статистики

    let grades: Map<categories, graderResult> = new Map();
    if (project) {
        grades = grader(project);
    }

    const gradeKeys = Array.from(grades.keys());

    // суммарная оценка за проект
    const totalGrade = getTotalGrade(grades);

    // максимальная возможная оценка по всем категориям оценивания
    const maxGrade = getMaxGrade(grades);

    useEffect(() => {
        // отправка оценок на сервер
        if (grades.size > 0) {
            posthog.capture("Grades", Object.fromEntries(grades));
        }
    }, [grades]);

    return <GradesList grades={grades} />;
}

export default GradesContainer;
