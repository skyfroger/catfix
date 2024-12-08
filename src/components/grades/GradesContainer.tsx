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
import { ScratchProject } from "catfix-utils/dist/scratch";

interface gradesContainerProps {
    projectJson: ScratchProject | null;
    project: Project | null;
}
function GradesContainer({ projectJson, project }: gradesContainerProps) {
    let grades: Map<categories, graderResult> = new Map();
    if (project && projectJson) {
        grades = grader(projectJson, project);
    }

    return <GradesList grades={grades} />;
}

export default GradesContainer;
