import react, { useEffect, useState } from "react";
import { Card, Col, Row } from "antd";
import MassURLLoader from "../ui/MassURLLoader";
import ProjectsDataTable, { TableData } from "../teacher/ProjectsDataTable";
import { APIResponce } from "../../utils/httpAPI";
import parseProject from "../../utils";
import grader, { getTotalGrade } from "../../graders";
import { Tip } from "../../scaners/types";
import { scanForErrors, scanForWarnings } from "../../scaners";
import { motion } from "framer-motion";
import { basicAnimations } from "../../utils/animations";
import UploadProject from "../ui/UploadProject";
import React from "react";
import { RcFile } from "antd/es/upload";
import { loadAsync } from "jszip";
import { ScratchProject } from "../../../@types/scratch";
import { useTranslation } from "react-i18next";
import hash from "object-hash";
import Loader from "../ui/Loader";
import StatsContainer from "../teacher/StatsContainer";

function TeacherPage() {
    const [projectsData, setProjectsData] = useState<APIResponce[]>([]);
    const [tableData, setTableData] = useState<TableData[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const { t } = useTranslation();

    /**
     * Сохранение в state массива проектов
     * @param projects
     */
    const handleURLUpload = (projects: APIResponce[]) => {
        // хеши уже загруженных проектов
        const hashes = projectsData.map((pd) => pd.key);

        // фильтруем новые загруженные по сети проекты
        // хэш нового проекта должен быть уникальным
        const uniqUploadedProjects = projects.filter(
            (p) => !hashes.includes(p.key)
        );
        // добавляем новые проекты к уже существующим
        setProjectsData(() => [...projectsData, ...uniqUploadedProjects]);
    };

    /**
     * Очистка таблицы
     */
    const handleTableClearing = () => {
        setProjectsData([]);
    };

    /**
     * Удаление одной записи из таблицы
     * @param key ключ записи
     */
    const handleFilter = (key: React.Key) => {
        const newProjectData = projectsData.filter(
            (record) => record.key !== key
        );
        setProjectsData(newProjectData);
    };

    const handleUpload = (project: RcFile, projects: RcFile[]) => {
        const loadedProjects: APIResponce[] = []; // пустой список файлов

        const promiseList = []; // массив промисов

        // хеши уже загруженных проектов
        const hashes = projectsData.map((pd) => pd.key);

        setIsLoading(true);
        // перебираем массив архивов, чтобы каждый распаковать
        for (const file of projects) {
            // распаковываем архив
            promiseList.push(
                loadAsync(file)
                    .then(function (content) {
                        return content.files["project.json"].async("text");
                    })
                    .then(function (txt) {
                        const projectJSON: ScratchProject = JSON.parse(txt);
                        // получаем хэш нового проекта
                        const projectHash = hash.sha1(projectJSON);
                        // если такого проекта пока нет в таблице - добавляем
                        if (!hashes.includes(projectHash)) {
                            loadedProjects.push({
                                key: hash.sha1(projectJSON),
                                projectJSON: projectJSON,
                                projectName: file.name,
                                projectAuthor: "-",
                            });
                        }
                    })
                    .catch(function (error) {})
            );
        }

        // Ждём, пока завершатся все промисы
        Promise.all(promiseList)
            .then(
                () => {
                    // добавляем новые проекты к уже существующим
                    setProjectsData(() => [...projectsData, ...loadedProjects]);
                },
                (e) => {
                    console.error(e);
                }
            )
            .finally(() => {
                setIsLoading(false);
            });
    };

    useEffect(() => {
        // как только получены новые проекты, нужно их парсить, оценить
        // и получить список советов

        const tableData: TableData[] = [];

        // перебираем загруженные проекты
        projectsData.forEach((project, index) => {
            // парсим проект
            const parsedProject = parseProject(project.projectJSON);
            // оцениваем проект
            const grades = grader(parsedProject);

            // суммарная оценка
            const totalGrade = getTotalGrade(grades);

            // получаем массив советов (ошибок и предупреждений)
            const tips: Tip[] = [
                ...scanForErrors(parsedProject, project.projectJSON),
                ...scanForWarnings(parsedProject, project.projectJSON),
            ];

            // сохраняем данные для строки в таблице (порядок колонок определяется тут)
            tableData.push({
                key: project.key,
                projectAuthor: project.projectAuthor,
                projectName: project.projectName,
                grades: grades,
                tips: tips,
                totalGrade: totalGrade,
            });
        });

        // меняем state
        setTableData(tableData);
    }, [projectsData]);

    return (
        <>
            <motion.div
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={basicAnimations}
            >
                <Card style={{ marginBottom: 16 }}>
                    <Row gutter={16}>
                        <Col sm={24} lg={12}>
                            <UploadProject
                                multiple={true}
                                onUpload={handleUpload}
                            />
                        </Col>
                        <Col sm={24} lg={12}>
                            <MassURLLoader onUpload={handleURLUpload} />
                        </Col>
                    </Row>
                    {isLoading && <Loader />}
                </Card>
            </motion.div>
            <motion.div
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={basicAnimations}
                transition={{ delay: 0.8 }}
            >
                <Card style={{ marginBottom: 16 }}>
                    <ProjectsDataTable
                        data={tableData}
                        onClear={handleTableClearing}
                        onFilter={handleFilter}
                    />
                </Card>
            </motion.div>

            <motion.div
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={basicAnimations}
                transition={{ delay: 1.8 }}
            >
                <Card style={{ marginBottom: 16 }}>
                    <StatsContainer
                        projects={projectsData}
                        tableData={tableData}
                    />
                </Card>
            </motion.div>
        </>
    );
}

export default TeacherPage;
