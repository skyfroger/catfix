/**
 * Вывод списка оценок проекта по ряду критериев.
 */

import React, { useEffect } from "react";
import { TrophyOutlined } from "@ant-design/icons";
import { Project } from "../../@types/parsedProject";
import grader, { categories, gradesEnum } from "../graders";
import { useTranslation } from "react-i18next";
import GradeItem from "./GradeItem";
import { Card, Empty } from "antd";
import { motion, AnimatePresence } from "framer-motion";

import { usePostHog } from "posthog-js/react";

interface gradesListProps {
    project: Project | null;
}

function GradesList({ project }: gradesListProps) {
    const { t } = useTranslation();
    const posthog = usePostHog();

    let grades: Map<categories, gradesEnum> = new Map();
    if (project) {
        grades = grader(project);
    }

    const gradeKeys = Array.from(grades.keys());

    // суммарная оценка
    const totalGrade = Array.from(grades.values()).reduce(
        (previousValue, currentValue, currentIndex, array) => {
            return previousValue + currentValue;
        },
        0
    );

    useEffect(() => {
        if (grades.size !== 0) {
            // отправляем статистику с результатами проверки
            posthog.capture("grades", Object.fromEntries(grades));
        }
    }, [grades]);

    return (
        <AnimatePresence mode="wait">
            <Card>
                {!project && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        <Empty description={<p>{t("ui.noGrade")}</p>}></Empty>
                    </motion.div>
                )}

                {project && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        <h2>
                            <TrophyOutlined />{" "}
                            {t("ui.totalGrade", {
                                totalGrade: totalGrade,
                                maxGrade: 21,
                            })}
                        </h2>
                        {gradeKeys.map((category, index) => (
                            <GradeItem
                                key={category}
                                category={category}
                                grade={grades.get(category) ?? gradesEnum.zero}
                            />
                        ))}
                    </motion.div>
                )}
            </Card>
        </AnimatePresence>
    );
}

export default GradesList;
