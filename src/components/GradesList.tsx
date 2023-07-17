/**
 * Вывод списка оценок проекта по ряду критериев.
 */

import React, { useEffect } from "react";
import { TrophyOutlined } from "@ant-design/icons";
import { Project } from "../../@types/parsedProject";
import grader, {
    categories,
    getMaxGrade,
    getTotalGrade,
    graderResult,
    gradesEnum,
} from "../graders";
import { useTranslation } from "react-i18next";
import GradeItem from "./GradeItem";
import { Card, Empty } from "antd";
import { motion, AnimatePresence } from "framer-motion";

import { usePostHog } from "posthog-js/react";
import { basicAnimations } from "../utils/animations";

interface gradesListProps {
    project: Project | null;
}

function GradesList({ project }: gradesListProps) {
    const { t } = useTranslation();
    const posthog = usePostHog(); // для отправки статистики

    let grades: Map<categories, graderResult> = new Map();
    if (project) {
        grades = grader(project);
    }

    const gradeKeys = Array.from(grades.keys());

    // суммарная оценка за проект
    const totalGrade = getTotalGrade(grades);

    // максимальная возможная оценка по всем категориям оценивания
    const maxGrade = getMaxGrade(grades);

    useEffect(() => {
        // отправка оценок на сервер
        if (grades.size > 0) {
            posthog.capture("Grades", Object.fromEntries(grades));
        }
    }, [grades]);

    return (
        <AnimatePresence mode="wait">
            <Card>
                {!project && (
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={basicAnimations}
                        transition={{ duration: 1, delay: 0.5 }}
                    >
                        <Empty description={<p>{t("ui.noGrade")}</p>}></Empty>
                    </motion.div>
                )}

                {project && (
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={basicAnimations}
                        transition={{ duration: 1, delay: 0.5 }}
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
