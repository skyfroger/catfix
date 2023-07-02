/**
 * Вывод результатов сканирования проекта: предупреждения и ошибки в коде
 */

import React from "react";
import { Project } from "../../@types/parsedProject";
import { ScratchProject } from "../../@types/scratch";
import { Card } from "antd";
import { scanForWarnings } from "../scaners";
import { Tip } from "../scaners/types";
import TipItem from "./TipItem";

interface scanResultsListProps {
    fileName: string | null;
    project: Project | null;
    projectJSON: ScratchProject | null;
}

function ScanResultsList({
    fileName,
    project,
    projectJSON,
}: scanResultsListProps) {
    let warnings: Tip[] = [];
    if (projectJSON && project) {
        warnings = scanForWarnings(project, projectJSON);
        console.log(warnings);
    }

    return (
        <Card>
            {fileName && <h2>Примечания</h2>}
            {warnings.map((item, index) => {
                return (
                    <TipItem
                        key={index}
                        type={item.type}
                        message={item.message}
                        payload={item.payload}
                        code={item.code}
                    />
                );
            })}
        </Card>
    );
}

export default ScanResultsList;