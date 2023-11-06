/**
 * Компонент-контейнер для расчёта оценок
 */

import react, { useEffect } from "react";
import { Project } from "catfix-utils/dist/parsedProject";
import grader, {
    categories,
    getMaxGrade,
    getTotalGrade,
    graderResult,
} from "catfix-utils/dist/graders";
import GradesList from "./GradesList";

interface gradesContainerProps {
    project: Project | null;
}
function GradesContainer({ project }: gradesContainerProps) {
    let grades: Map<categories, graderResult> = new Map();
    if (project) {
        grades = grader(project);
    }

    return <GradesList grades={grades} />;
}

export default GradesContainer;
