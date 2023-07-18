/**
 * Вывод результатов сканирования проекта: предупреждения и ошибки в коде
 */

import React, { useEffect, useState } from "react";
import { Button, Card, Empty, List, Popover, Space } from "antd";
import { ToolOutlined } from "@ant-design/icons";
import { Tip } from "../../scaners/types";
import TipItem from "./TipItem";
import { useTranslation } from "react-i18next";
import TipsSummary from "./TipsSummary";
import { motion, AnimatePresence } from "framer-motion";
import { basicAnimations } from "../../utils/animations";

interface scanResultsListProps {
    errorsWithWarnings: Tip[];
}

// сколько советов загружать за одно нажатие кнопки Далее
const ITEMS_INC = 7;

function ScanResultsList({ errorsWithWarnings }: scanResultsListProps) {
    const { t } = useTranslation();
    const [listItems, setListItems] = useState<Tip[]>([]); // массив для элемента List
    const [itemsCount, setItemsCount] = useState(ITEMS_INC); // текущее количество советов

    useEffect(() => {
        setListItems(errorsWithWarnings.slice(0, ITEMS_INC));
    }, [errorsWithWarnings]);

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
                {errorsWithWarnings.length !== 0 && (
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={basicAnimations}
                        transition={{ delay: 0.8 }}
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
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={basicAnimations}
                    transition={{ delay: 0.8 }}
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
