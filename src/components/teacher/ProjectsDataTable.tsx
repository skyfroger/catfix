import react, { useEffect, useState } from "react";
import { Button, Empty, Modal, Popconfirm, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import React from "react";
import { categories, getMaxGrade, graderResult } from "../../graders";
import { Tip } from "../../scaners/types";
import { useTranslation } from "react-i18next";
import FullProjectInfo from "./FullProjectInfo";
import GradeButton from "./GradeButton";
import TipsCount from "./TipsCount";

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
    onClear: () => void;
}

function ProjectsDataTable({ data, onClear }: propsDataTable) {
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
            // оценки и ключ не добавляем в таблицу (пропускаем итерацию)
            if (key === "grades" || key === "key") continue;

            // в заголовке к общей оценке показываем максимально возможный балл
            if (key === "totalGrade") {
                cols.push({
                    title: t(`table.${key}`, { maxGrade: maxGrade }),
                    dataIndex: key,
                    sorter: (a, b) => a.totalGrade - b.totalGrade,
                    sortDirections: ["ascend", "descend"],
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
                        sorter: tipsSorter,
                        sortDirections: ["ascend", "descend"],
                        render: (tips: Tip[], record: TableData) => {
                            return <TipsCount tips={tips} />;
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
            <div style={{ marginBottom: 16 }}>
                <Popconfirm
                    title={t("ui.clearTableButton")}
                    description={t("ui.deleteTableDataConfirm")}
                    okText={t("ui.ok")}
                    cancelText={t("ui.cancel")}
                    onConfirm={onClear}
                >
                    <Button type="dashed" danger>
                        {t("ui.clearTableButton")}
                    </Button>
                </Popconfirm>
            </div>
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
