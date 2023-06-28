/**
 * Компонент отвечает за вывод оценки по одной из категорий.
 */

import React from "react";
import { categories, gradesEnum } from "../graders";
import { Progress } from "antd";
import { useTranslation } from "react-i18next";

interface GradeItemProps {
    category: categories;
    grade: gradesEnum;
}

function GradeItem({ category, grade }: GradeItemProps) {
    const { t } = useTranslation();

    // умножение на 33.3 помогает перевести отмету из баллов в проценты.
    // округление происходит вверх
    return (
        <>
            <h2>{t(`${category}.title`)}</h2>
            <p>{t(`${category}.${grade}`)}</p>
            <Progress
                type="circle"
                percent={Math.ceil(33.3 * grade)}
                format={(percent) => grade}
            />
        </>
    );
}

export default GradeItem;
