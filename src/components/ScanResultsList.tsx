/**
 * Вывод результатов сканирования проекта: предупреждения и ошибки в коде
 */

import React, { useEffect, useState } from "react";
import { Project } from "../../@types/parsedProject";
import { ScratchProject } from "../../@types/scratch";
import { Button, Card, Empty, List } from "antd";
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

// сколько советов загружать за одно нажатие кнопки Далее
const ITEMS_INC = 7;

function ScanResultsList({
    fileName,
    project,
    projectJSON,
}: scanResultsListProps) {
    const { t } = useTranslation();
    const [errorsWithWarnings, setErrorsWithWarnings] = useState<Tip[]>([]);
    const [listItems, setListItems] = useState<Tip[]>([]); // массив для элемента List
    const [itemsCount, setItemsCount] = useState(0); // текущее количество советов

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
            setListItems(l.slice(0, ITEMS_INC)); // берём ITEMS_INC первых советов
            setItemsCount(ITEMS_INC);
        }
    }, [project]);

    useEffect(() => {
        // как только нажимают кнопку Далее, добавляем к списку следующие ITEMS_INC советов
        setListItems(() => {
            return errorsWithWarnings.slice(0, itemsCount);
        });
    }, [itemsCount]);

    const onLoadMore = () => {
        // увеличиваем количество советов, которые нужно показать на ITEMS_INC
        setItemsCount(() => {
            return itemsCount + ITEMS_INC;
        });
    };

    // Кнопка для загрузки следующих советов
    const loadMore =
        itemsCount < errorsWithWarnings.length ? (
            <div
                style={{
                    textAlign: "center",
                    marginTop: 12,
                    height: 32,
                    lineHeight: "32px",
                }}
            >
                <Button type="primary" size={"middle"} onClick={onLoadMore}>
                    {t("ui.showNextTips")}
                </Button>
            </div>
        ) : null;

    return (
        <Card>
            {project && (
                <h2>
                    <ToolOutlined /> {t("ui.tips")}
                </h2>
            )}
            <List
                dataSource={listItems}
                loadMore={loadMore}
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
