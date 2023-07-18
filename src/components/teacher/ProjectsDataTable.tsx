import react, { useEffect, useState } from "react";
import { Empty, Modal, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import React from "react";
import { categories, getMaxGrade, graderResult } from "../../graders";
import { Tip } from "../../scaners/types";
import { useTranslation } from "react-i18next";
import FullProjectInfo from "./FullProjectInfo";
import GradeButton from "./GradeButton";

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

    // текущий проект, которые нужно показать в модальном окне
    const [currentProject, setCurrentProject] = useState<TableData>(
        {} as TableData
    );

    // модальное окно открыто?
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { t } = useTranslation();

    useEffect(() => {
        // берём первый элемент, чтобы заполнить список столбцов таблицы
        const d = data || [];
        const firstProject = d[0] || {};
        const maxGrade = getMaxGrade(firstProject.grades || new Map());

        const cols: ColumnsType<TableData> = [];
        // пока пропускаем детализацию оценок, советы и ключ
        for (const key in firstProject) {
            if (key === "grades" || key === "key") continue;

            // в заголовке к общей оценке показываем максимально возможный балл
            if (key === "totalGrade") {
                cols.push({
                    title: t(`table.${key}`, { maxGrade: maxGrade }),
                    dataIndex: key,
                    render: (grade: number, record: TableData) => {
                        return (
                            <GradeButton
                                record={record}
                                onMoreInfo={handleMoreInfo}
                            />
                        );
                    },
                });
            } else {
                /*
                Попался ключ с советами.
                Рисуем компонент с количеством ошибок и предупреждений
                 */
                if (key === "tips") {
                    cols.push({
                        title: t(`table.tips`),
                        dataIndex: "tips",
                        render: (
                            tips: Tip[],
                            record: TableData,
                            index: number
                        ) => {
                            return <span>{tips.length}</span>;
                        },
                    });
                } else {
                    // В остальных случаях просто сохраняем заголовок и ключ
                    cols.push({
                        title: t(`table.${key}` as any),
                        dataIndex: key,
                    });
                }
            }
        }

        // сохраняем данные в state
        setColumns(cols);
        setTableData(data);
    }, [data]);

    const handleMoreInfo = (record: TableData) => {
        setCurrentProject(record);
        setIsModalOpen(true);
    };

    const handleModalClosing = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <Table
                size={"large"}
                bordered={true}
                columns={columns}
                dataSource={tableData}
                locale={{
                    emptyText: <Empty description={t("ui.noGrade")}></Empty>,
                }}
            />
            <Modal
                open={isModalOpen}
                onOk={handleModalClosing}
                onCancel={handleModalClosing}
                width={"80%"}
                footer={null}
            >
                <FullProjectInfo data={currentProject} />
            </Modal>
        </>
    );
}

export default ProjectsDataTable;
