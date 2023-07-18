import react, { useEffect, useState } from "react";
import { Col, Empty, Row, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import React from "react";
import { categories, getMaxGrade, graderResult } from "../../graders";
import { Tip } from "../../scaners/types";
import { useTranslation } from "react-i18next";
import FullProjectInfo from "./FullProjectInfo";

// интерфейс для описания одной строки таблицы
export interface TableData {
    key: React.Key;
    projectAuthor: string;
    projectName: string;
    totalGrade: number;
    grades: Map<categories, graderResult>;
    tips: Tip[];
}

// пропсы для компонента
interface propsDataTable {
    data: TableData[];
}

function ProjectsDataTable({ data }: propsDataTable) {
    const [columns, setColumns] = useState<ColumnsType<TableData>>([]);
    const [tableData, setTableData] = useState<TableData[]>([]);

    // текущие оценки, которые нужно показать в модальном окне
    const [currentGrades, setCurrentGrades] = useState<
        Map<categories, graderResult>
    >(new Map());

    const { t } = useTranslation();

    useEffect(() => {
        // берём первый элемент, чтобы заполнить список столбцов таблицы
        const d = data || [];
        const firstProject = d[0] || {};
        const maxGrade = getMaxGrade(firstProject.grades || new Map());

        const cols: ColumnsType<TableData> = [];
        // пока пропускаем детализацию оценок, советы и ключ
        for (const key in firstProject) {
            if (key === "grades" || key === "tips" || key === "key") continue;

            // в заголовке к общей оценке показываем максимально возможный балл
            if (key === "totalGrade") {
                cols.push({
                    title: t(`table.${key}`, { maxGrade: maxGrade }),
                    dataIndex: key,
                });
            } else {
                cols.push({
                    title: t(`table.${key}` as any),
                    dataIndex: key,
                });
            }
        }

        // сохраняем данные в state
        setColumns(cols);
        setTableData(data);
    }, [data]);

    return (
        <>
            <Table
                size={"large"}
                bordered={true}
                columns={columns}
                dataSource={tableData}
                expandable={{
                    expandedRowRender: (record) => (
                        <FullProjectInfo data={record} />
                    ),
                }}
                locale={{
                    emptyText: <Empty description={t("ui.noGrade")}></Empty>,
                }}
            />
        </>
    );
}

export default ProjectsDataTable;
