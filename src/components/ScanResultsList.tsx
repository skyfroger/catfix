/**
 * Вывод результатов сканирования проекта: предупреждения и ошибки в коде
 */

import React from "react";
import { Project } from "../../@types/parsedProject";
import { ScratchProject } from "../../@types/scratch";
import { Card } from "antd";
import { ToolOutlined } from "@ant-design/icons";
import { scanForErrors, scanForWarnings } from "../scaners";
import { Tip } from "../scaners/types";
import TipItem from "./TipItem";
import { useTranslation } from "react-i18next";

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
    const { t } = useTranslation();
    let warnings: Tip[] = [];
    let errors: Tip[] = [];
    if (projectJSON && project) {
        warnings = scanForWarnings(project, projectJSON);
        errors = scanForErrors(project, projectJSON);
        console.log(warnings);
    }

    const errorsWithWarnings = [...errors, ...warnings];

    return (
        <Card>
            {!project && <p>{t("ui.noTips")}</p>}
            {project && (
                <h2>
                    <ToolOutlined /> {t("ui.tips")}
                </h2>
            )}
            {errorsWithWarnings.map((item, index) => {
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
