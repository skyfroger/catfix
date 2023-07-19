import react, { SyntheticEvent, useEffect, useState } from "react";
import { Button, Empty, Modal, Popconfirm, Table } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import React from "react";
import { categories, getMaxGrade, graderResult } from "../../graders";
import { Tip } from "../../scaners/types";
import { useTranslation } from "react-i18next";
import FullProjectInfo from "./FullProjectInfo";
import TipsCount from "./TipsCount";
import DeleteConfirmButton from "../ui/DeleteConfirmButton";

// интерфейс для описания одной строки таблицы
export interface TableData {
    key: string;
    projectAuthor: string;
    projectName: string;
    totalGrade: number;
    grades: Map<categories, graderResult>;
    tips: Tip[];
}

// пропсы для компонента
interface propsDataTable {
    data: TableData[];
    onClear: () => void;
    onFilter: (key: string) => void;
}

function ProjectsDataTable({ data, onClear, onFilter }: propsDataTable) {
    // текущий проект, которые нужно показать в модальном окне
    const [currentProject, setCurrentProject] = useState<TableData>(
        {} as TableData
    );
    const [isModalOpen, setIsModalOpen] = useState(false); // модальное окно открыто?
    const { t } = useTranslation();

    const onCellHandle = (record: TableData, index: number | undefined) => {
        return {
            onClick: (event: SyntheticEvent) => handleMoreInfo(record),
        };
    };

    // берём первый проект и вычисляем максимально возможную оценку
    const d = data || [];
    const firstProject = d[0] || {};
    const maxGrade = getMaxGrade(firstProject.grades || new Map());

    // описание колонок таблицы
    const tableColumns: ColumnsType<TableData> = [
        {
            title: t("table.projectAuthor"),
            dataIndex: "projectAuthor",
            onCell: onCellHandle,
            sorter: (a, b) => a.projectAuthor.localeCompare(b.projectAuthor),
            sortDirections: ["ascend", "descend"],
        },
        {
            title: t("table.projectName"),
            dataIndex: "projectName",
            onCell: onCellHandle,
            sorter: (a, b) => a.projectName.localeCompare(b.projectName),
            sortDirections: ["ascend", "descend"],
        },
        {
            title: t("table.tips"),
            dataIndex: "tips",
            align: "center",
            sorter: tipsSorter,
            sortDirections: ["descend", "ascend"],
            render: (tips: Tip[], record: TableData) => {
                return <TipsCount tips={tips} />;
            },
            onCell: onCellHandle,
        },
        {
            title: t(`table.totalGrade`, { maxGrade: maxGrade }),
            dataIndex: "totalGrade",
            sorter: (a, b) => a.totalGrade - b.totalGrade,
            sortDirections: ["descend", "ascend"],
            align: "center",
            onCell: onCellHandle,
        },
        {
            title: t("ui.deleteTitle"),
            dataIndex: "delete",
            align: "center",
            render: (_, record: TableData) => {
                return (
                    <DeleteConfirmButton
                        onConfirm={() => {
                            onFilter(record.key);
                        }}
                    >
                        <DeleteOutlined />
                    </DeleteConfirmButton>
                );
            },
        },
    ];

    /**
     * Открываем модальное окно с подробной информацией о проекте
     * @param record
     */
    const handleMoreInfo = (record: TableData) => {
        setCurrentProject(record);
        setIsModalOpen(true);
    };

    /**
     * Закрываем модальное окно
     */
    const handleModalClosing = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <div style={{ marginBottom: 16 }}>
                <DeleteConfirmButton onConfirm={onClear}>
                    <span>{t("ui.clearTable")}</span>
                </DeleteConfirmButton>
            </div>
            <Table
                style={{ overflow: "auto" }}
                size={"large"}
                bordered={true}
                columns={tableColumns}
                dataSource={data}
                locale={{
                    emptyText: <Empty description={t("ui.noGrade")}></Empty>,
                }}
                pagination={{ pageSize: 20 }}
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

/**
 * Функция сортировки проектов по количеству ошибок и предупреждений.
 * Приоритет отдаётся проектам с ошибками. Они будут выше в списке.
 * Вес одной ошибки указан в константе ERROR_WEIGHT (сейчас 100)
 * @param a первый проект
 * @param b второй проект
 */
function tipsSorter(a: TableData, b: TableData) {
    const ERROR_WEIGHT = 100;

    // вычисляем количество ошибок и предупреждений в первом проекте
    const bugsNumberA = a.tips.filter((tip) => tip.type === "error").length;
    const warningsNumberA = a.tips.length - bugsNumberA;

    // вычисляем количество ошибок и предупреждений во втором проекте
    const bugsNumberB = b.tips.filter((tip) => tip.type === "error").length;
    const warningsNumberB = b.tips.length - bugsNumberB;

    // количество ошибок умножаем на вес, чтобы дать им приоритет перед предупреждениями
    return (
        ERROR_WEIGHT * bugsNumberA +
        warningsNumberA -
        (ERROR_WEIGHT * bugsNumberB + warningsNumberB)
    );
}

export default ProjectsDataTable;
