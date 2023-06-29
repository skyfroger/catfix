/**
 * Компонент отвечает за вывод оценки по одной из категорий.
 */

import React from "react";
import { categories, gradesEnum } from "../graders";
import { Col, Divider, Progress, Row, theme } from "antd";
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
     * Выводт оценки за категорию. Показывается балл и текстовое описание.
     */
    const { t } = useTranslation();

    // умножение на 33.3 помогает перевести отмету из баллов в проценты.
    // округление происходит вверх
    return (
        <>
            <Divider />
            <Row>
                <Col span={24}>
                    <h2>{t(`${category}.title`)}</h2>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col>
                    <Progress
                        type="circle"
                        percent={Math.ceil(33.3 * grade)}
                        format={(percent) => grade}
                    />
                </Col>
                <Col>
                    <GradeDesc category={category} grade={grade} />
                </Col>
            </Row>
        </>
    );
}

export default GradeItem;
