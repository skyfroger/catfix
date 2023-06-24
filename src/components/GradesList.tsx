/**
 * Вывод списка оценок проекта по ряду критериев.
 */

import React, { useState } from "react";
import { toScratchblocks } from "parse-sb3-blocks/dist/parse-sb3-blocks.module";

interface gradesListProps {
    project: JSON;
}

function GradesList({ project }: gradesListProps) {
    return (
        <div>
            <pre>{JSON.stringify(project)}</pre>
        </div>
    );
}

export default GradesList;
