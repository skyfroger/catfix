/**
 * Компонент отвечает за вывод оценки по одной из категорий.
 */

import React from "react";
import { categories, gradesEnum } from "../graders";
import { Col, Divider, Progress, Row, Space, theme } from "antd";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

interface GradeItemProps {
    category: categories;
    grade: gradesEnum;
}

function GradeDesc({ category, grade }: GradeItemProps) {
    /**
     * Вывод всех критериев оценивания и подсвечивание описания, исходя из полученного балла
     */
    const { t } = useTranslation();
    const themeConfig = theme.useToken();

    return (
        <ol start={0} style={{ marginTop: 0 }}>
            {[0, 1, 2, 3].map((g: gradesEnum, index) => {
                // описываем стиль для активного элемента списка, в котором находится текст
                // описывающий заработанный балл
                const active =
                    g === grade
                        ? {
                              color: themeConfig.token.colorPrimaryTextActive,
                              fontWeight: "bold",
                          }
                        : { color: themeConfig.token.colorPrimaryText };
                return (
                    <li key={index} style={{ ...active }}>
                        {t(`${category}.${g}`)}
                    </li>
                );
            })}
        </ol>
    );
}

function GradeItem({ category, grade }: GradeItemProps) {
    /**
     * Вывод оценки за категорию. Показывается балл и текстовое описание.
     */
    const { t } = useTranslation();

    // Умножение на 33.3 помогает перевести отмету из баллов в проценты.
    // Округление происходит вверх
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            exit={{ opacity: 0, y: -10 }}
        >
            <Divider />
            <Row>
                <Col span={24}>
                    <h3>{t(`${category}.title`)}</h3>
                </Col>
            </Row>
            <Row gutter={8}>
                <Col span={24}>
                    <Space>
                        <Progress
                            type="circle"
                            percent={Math.ceil(33.3 * grade)}
                            format={(percent) => `${grade}/3`}
                        />

                        <GradeDesc category={category} grade={grade} />
                    </Space>
                </Col>
            </Row>
        </motion.div>
    );
}

export default GradeItem;
