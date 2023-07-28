/**
 * Компонент отвечает за вывод оценки по одной из категорий.
 */

import React from "react";
import { categories, gradesEnum } from "catfix-utils/dist/graders";
import { Col, Divider, Progress, Row, Space, theme } from "antd";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { basicAnimations } from "../../utils/animations";

interface GradeItemProps {
    category: categories;
    grade: gradesEnum;
    maxGrade: gradesEnum;
}

function GradeDesc({ category, grade, maxGrade }: GradeItemProps) {
    /**
     * Вывод всех критериев оценивания и подсвечивание описания, исходя из полученного балла
     */
    const { t } = useTranslation();
    const themeConfig = theme.useToken();

    // + 1 потому что при максимальной оценке maxGrade, есть maxGrade + 1 вариантов оценки
    // например maxGrade = 3, возможные оценки: 0, 1, 2, 3 - всего 4 варианта
    return (
        <ol start={0} style={{ marginTop: 0 }}>
            {Array.from(Array(maxGrade + 1).keys()).map(
                (g: gradesEnum, index) => {
                    // описываем стиль для активного элемента списка, в котором находится текст
                    // описывающий заработанный балл
                    const active =
                        g === grade
                            ? {
                                  color: themeConfig.token
                                      .colorPrimaryTextActive,
                                  fontWeight: "bold",
                              }
                            : { color: themeConfig.token.colorPrimaryText };
                    return (
                        <li key={index} style={{ ...active }}>
                            {t(`${category}.${g}` as any)}
                        </li>
                    );
                }
            )}
        </ol>
    );
}

function GradeItem({ category, grade, maxGrade }: GradeItemProps) {
    /**
     * Вывод оценки за категорию. Показывается балл и текстовое описание.
     */
    const { t } = useTranslation();

    // Умножение на 100 / maxGrade помогает перевести отмету из баллов в проценты.
    // Округление происходит вверх
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={basicAnimations}
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
                            percent={Math.ceil((100 / maxGrade) * grade)}
                            format={(percent) => `${grade}/${maxGrade}`}
                        />

                        <GradeDesc
                            category={category}
                            grade={grade}
                            maxGrade={maxGrade}
                        />
                    </Space>
                </Col>
            </Row>
        </motion.div>
    );
}

export default GradeItem;
