import react, { useEffect, useState } from "react";
import { Card, Col, Row, Typography, message } from "antd";
import MassURLLoader from "../ui/MassURLLoader";
import ProjectsDataTable, { TableData } from "../teacher/ProjectsDataTable";
import { APIResponce, projectAPI } from "../../utils/httpAPI";
import { parseProject } from "catfix-utils/dist";
import { grader, getTotalGrade } from "catfix-utils/dist";
import { Tip } from "catfix-utils/dist/scaners/types";
import { scanForErrors, scanForWarnings } from "catfix-utils/dist";
import { motion } from "framer-motion";
import { basicAnimations } from "../../utils/animations";
import UploadProject from "../ui/UploadProject";
import React from "react";
import { RcFile } from "antd/es/upload";
import { loadAsync } from "jszip";
import { ScratchProject } from "catfix-utils/dist/scratch";
import { useTranslation } from "react-i18next";
import hash from "object-hash";
import Loader from "../ui/Loader";
import StatsContainer from "../teacher/StatsContainer";
import { Helmet } from "react-helmet-async";

function TeacherPage() {
    const [projectsData, setProjectsData] = useState<APIResponce[]>([]);
    const [tableData, setTableData] = useState<TableData[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const { t } = useTranslation();
    const [messageApi, contextHolder] = message.useMessage();

    /**
     * Сохранение в state массива проектов
     * @param projects
     */
    const handleURLUpload = (projects: APIResponce[]) => {
        // хеши уже загруженных проектов
        const hashes = projectsData.map((pd) => pd.key);
        // id проектов, которые уже находятся в таблице
        const siteIds: number[] = projectsData.map((pd) =>
            pd.siteId ? pd.siteId : 0
        );

        // фильтруем новые загруженные по сети проекты
        // хэш нового проекта и его siteId должны быть уникальными
        const uniqUploadedProjects = projects.filter(
            (p) => !hashes.includes(p.key) && !siteIds.includes(p.siteId ?? 0)
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
        setProjectsData((projectsData) =>
            projectsData.filter((record) => record.key !== key)
        );
    };

    const handleUpdate = (updatedRecord: TableData) => {
        if (!updatedRecord.siteId) return;

        const data = projectsData.filter(
            (project) => project.siteId !== updatedRecord.siteId
        );

        async function load(projectId: number) {
            const updateProject = await projectAPI.get(projectId);
            setProjectsData([...data, updateProject]);
            messageApi.open({
                type: "success",
                content: t("ui.uploadFinished"),
            });
        }

        load(updatedRecord.siteId);
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

                        // по-ошибке могут загрузить проект из Scratch 2.0
                        // такой проект пропускаем
                        if ("info" in projectJSON) {
                            throw new Error("Загружен проект второй версии.");
                        }
                        // получаем хэш нового проекта
                        const projectHash = hash.sha1(projectJSON);
                        // если такого проекта пока нет в таблице - добавляем
                        if (!hashes.includes(projectHash)) {
                            loadedProjects.push({
                                key: hash.sha1(projectJSON),
                                siteId: null,
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
        // todo проверка начинается заново, как только удаляется или обновляется проект (нужно оптимизировать)
        projectsData.forEach((project, index) => {
            // парсим проект
            try {
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
                    siteId: project.siteId,
                    projectAuthor: project.projectAuthor,
                    projectName: project.projectName,
                    grades: grades,
                    tips: tips,
                    totalGrade: totalGrade,
                });
            } catch (e) {}
        });

        // меняем state
        setTableData(tableData);
    }, [projectsData]);

    return (
        <>
            <Helmet>
                <title>
                    КотФикс - Проверка Scratch проектов | Страница учителя
                </title>
                <meta
                    name="description"
                    content="Приложение для автоматической проверки Scratch-проектов. Проверка нескольких проектов. Статистика по частоте появления ошибок."
                />
            </Helmet>
            {contextHolder}
            <motion.div
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={basicAnimations}
            >
                <Card style={{ marginBottom: 16, backgroundColor: "#C0DBEA" }}>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Typography.Title>
                                {t("ui.massUploadTitle")}
                            </Typography.Title>
                            <Typography.Paragraph>
                                {t("ui.massUploadDesc")}
                            </Typography.Paragraph>
                        </Col>
                    </Row>
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
                        onUpdate={handleUpdate}
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
