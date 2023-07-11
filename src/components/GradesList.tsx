/**
 * Вывод списка оценок проекта по ряду критериев.
 */

import React from "react";
import { TrophyOutlined } from "@ant-design/icons";
import { Project } from "../../@types/parsedProject";
import grader, { categories, graderResult, gradesEnum } from "../graders";
import { useTranslation } from "react-i18next";
import GradeItem from "./GradeItem";
import { Card, Empty } from "antd";
import { motion, AnimatePresence } from "framer-motion";

interface gradesListProps {
    project: Project | null;
}

function GradesList({ project }: gradesListProps) {
    const { t } = useTranslation();

    let grades: Map<categories, graderResult> = new Map();
    if (project) {
        grades = grader(project);
    }

    const gradeKeys = Array.from(grades.keys());

    // суммарная оценка
    const totalGrade = Array.from(grades.values()).reduce(
        (previousValue, currentValue, currentIndex, array) => {
            return previousValue + currentValue.grade;
        },
        0
    );

    // максимальная возможная оценка по всем категориям оценивания
    const maxGrade = Array.from(grades.values()).reduce(
        (pr, cur) => pr + cur.maxGrade,
        0
    );

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
