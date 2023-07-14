/**
 * Вывод результатов сканирования проекта: предупреждения и ошибки в коде
 */

import React, { useEffect, useState } from "react";
import { Project } from "../../@types/parsedProject";
import { ScratchProject } from "../../@types/scratch";
import { Button, Card, Empty, List, Popover, Space } from "antd";
import { ToolOutlined } from "@ant-design/icons";
import { scanForErrors, scanForWarnings } from "../scaners";
import { Tip } from "../scaners/types";
import TipItem from "./TipItem";
import { useTranslation } from "react-i18next";
import TipsSummary from "./TipsSummary";
import { motion, AnimatePresence } from "framer-motion";

import { usePostHog } from "posthog-js/react";

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
            setListItems(l.slice(0, ITEMS_INC)); // берём ITEMS_INC первых советов
            setItemsCount(ITEMS_INC);

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
        <AnimatePresence mode="wait">
            <Card>
                {project && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        <Space
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <h2>
                                <ToolOutlined /> {t("ui.tips")}
                            </h2>

                            {errorsWithWarnings.length > 0 && (
                                <Popover
                                    placement="bottomRight"
                                    content={
                                        <TipsSummary
                                            tips={errorsWithWarnings}
                                        />
                                    }
                                >
                                    <Button>Сводка</Button>
                                </Popover>
                            )}
                        </Space>
                    </motion.div>
                )}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    exit={{ opacity: 0, y: -10 }}
                >
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
                </motion.div>
            </Card>
        </AnimatePresence>
    );
}

export default ScanResultsList;
