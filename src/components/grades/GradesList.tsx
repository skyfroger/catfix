/**
 * Вывод списка оценок проекта по ряду критериев.
 */

import React from "react";
import { TrophyOutlined } from "@ant-design/icons";
import {
    categories,
    getMaxGrade,
    getTotalGrade,
    graderResult,
    gradesEnum,
} from "catfix-utils/dist/graders";
import { useTranslation } from "react-i18next";
import GradeItem from "./GradeItem";
import { Card, Empty } from "antd";
import { motion, AnimatePresence } from "framer-motion";

import { usePostHog } from "posthog-js/react";
import { basicAnimations } from "../../utils/animations";

interface gradesListProps {
    grades: Map<categories, graderResult>;
}

function GradesList({ grades }: gradesListProps) {
    const { t } = useTranslation();
    const posthog = usePostHog(); // для отправки статистики

    const gradeKeys = Array.from(grades.keys());

    // суммарная оценка за проект
    const totalGrade = getTotalGrade(grades);

    // максимальная возможная оценка по всем категориям оценивания
    const maxGrade = getMaxGrade(grades);

    return (
        <AnimatePresence mode="wait">
            <Card>
                {grades.size === 0 && (
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={basicAnimations}
                        transition={{ delay: 0.8 }}
                    >
                        <Empty description={<p>{t("ui.noGrade")}</p>}></Empty>
                    </motion.div>
                )}

                {grades.size > 0 && (
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={basicAnimations}
                        transition={{ delay: 0.8 }}
                    >
                        <h2>
                            <TrophyOutlined />{" "}
                            {t("ui.totalGrade", {
                                totalGrade: totalGrade,
                                maxGrade: maxGrade,
                            })}
                        </h2>
                        {gradeKeys.map((category, index) => (
                            <GradeItem
                                key={category}
                                category={category}
                                grade={
                                    grades.get(category)?.grade ??
                                    gradesEnum.zero
                                }
                                maxGrade={
                                    grades.get(category)?.maxGrade ??
                                    gradesEnum.zero
                                }
                            />
                        ))}
                    </motion.div>
                )}
            </Card>
        </AnimatePresence>
    );
}

export default GradesList;
