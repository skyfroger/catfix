/**
 * Вывод списка оценок проекта по ряду критериев.
 */

import React, { useState } from "react";
import { Project } from "../../@types/parsedProject";

interface gradesListProps {
  project: Project | null;
}

function GradesList({ project }: gradesListProps) {
  return <div>{project?.sprites[0].name}</div>;
}

export default GradesList;
