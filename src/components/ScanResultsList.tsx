/**
 * Вывод результатов сканирования проекта: предупреждения и ошибки в коде
 */

import React, { useEffect, useState } from "react";
import { Project } from "../../@types/parsedProject";
import { ScratchProject } from "../../@types/scratch";
import { Card, Empty, List } from "antd";
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
    const [errorsWithWarnings, setErrorsWithWarnings] = useState<Tip[]>([]);

    useEffect(() => {
        let warnings: Tip[] = [];
        let errors: Tip[] = [];
        if (projectJSON && project) {
            warnings = scanForWarnings(project, projectJSON);
            errors = scanForErrors(project, projectJSON);
            setErrorsWithWarnings([...errors, ...warnings]);
        }
    }, [project]);

    // const errorsWithWarnings = [...errors, ...warnings];

    return (
        <Card>
            {project && (
                <h2>
                    <ToolOutlined /> {t("ui.tips")}
                </h2>
            )}
            <List
                dataSource={errorsWithWarnings}
                locale={{
                    emptyText: (
                        <Empty
                            description={<span>{t("ui.noTips")}</span>}
                        ></Empty>
                    ),
                }}
                renderItem={(tip: Tip) => (
                    <TipItem
                        type={tip.type}
                        title={tip.title}
                        message={tip.message}
                        payload={tip.payload}
                        code={tip.code}
                    />
                )}
            />
        </Card>
    );
}

export default ScanResultsList;
