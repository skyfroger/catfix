/**
 * Компонент-контейнер для получения списка замечаний к проекту
 */

import react, { useEffect, useState } from "react";
import { Project } from "catfix-utils/dist/parsedProject";
import { ScratchProject } from "catfix-utils/dist/scratch";
import { Tip } from "catfix-utils/dist/scaners/types";
import { scanForErrors, scanForWarnings } from "catfix-utils/dist";
import ScanResultsList from "./ScanResultsList";

interface scanContainerProps {
    project: Project | null;
    projectJSON: ScratchProject | null;
}

function ScanContainer({ project, projectJSON }: scanContainerProps) {
    const [errorsWithWarnings, setErrorsWithWarnings] = useState<Tip[]>([]);

    useEffect(() => {
        let warnings: Tip[] = [];
        let errors: Tip[] = [];
        if (projectJSON && project) {
            // получаем массив предупреждений
            warnings = scanForWarnings(project, projectJSON);
            // получаем массив ошибок
            errors = scanForErrors(project, projectJSON);
            // объединяем всё в один массив
            const l = [...errors, ...warnings];
            setErrorsWithWarnings(l); // сохраняем его в state
        }
    }, [project]);

    return (
        <>
            <ScanResultsList errorsWithWarnings={errorsWithWarnings} />
        </>
    );
}

export default ScanContainer;
