/**
 * Кнопка вызывает модальное меню с подробными оценками проекта
 */

import react from "react";
import { Button, Tooltip } from "antd";
import React from "react";
import { TableData } from "./ProjectsDataTable";
import { useTranslation } from "react-i18next";

interface gradeButtonProps {
    record: TableData;
    onMoreInfo: (record: TableData) => void;
}

function GradeButton({ record, onMoreInfo }: gradeButtonProps) {
    const { t } = useTranslation();

    return (
        <Tooltip mouseEnterDelay={3} title={t("ui.openProjectModalTooltip")}>
            <Button type={"primary"} onClick={() => onMoreInfo(record)}>
                {record.totalGrade}
            </Button>
        </Tooltip>
    );
}

export default GradeButton;
