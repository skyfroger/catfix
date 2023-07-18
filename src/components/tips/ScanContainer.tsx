/**
 * Компонент-контейнер для получения списка замечаний к проекту
 */

import react, { useEffect, useState } from "react";
import { Project } from "../../../@types/parsedProject";
import { ScratchProject } from "../../../@types/scratch";
import { usePostHog } from "posthog-js/react";
import { Tip } from "../../scaners/types";
import { scanForErrors, scanForWarnings } from "../../scaners";
import ScanResultsList from "./ScanResultsList";

interface scanContainerProps {
    project: Project | null;
    projectJSON: ScratchProject | null;
}

function ScanContainer({ project, projectJSON }: scanContainerProps) {
    const [errorsWithWarnings, setErrorsWithWarnings] = useState<Tip[]>([]);

    // для отправки статистики
    const posthog = usePostHog();

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

            // статистика по ошибкам для отправки на сервер
            let s: { [key: string]: number } = {};
            l.forEach((tip) => {
                if (s[tip.title]) {
                    s[tip.title] += 1;
                } else {
                    s[tip.title] = 1;
                }
            });
            posthog.capture("Tips", s);
        }
    }, [project]);

    return (
        <>
            <ScanResultsList errorsWithWarnings={errorsWithWarnings} />
        </>
    );
}

export default ScanContainer;
