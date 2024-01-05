/**
 * Главная страница приложения, на которой располагается форма загрузки файла с проектом,
 * список оценок и рекомендаций по устранению ошибок.
 */

import React, { useState, useEffect } from "react";
import { Card, Col, message, Row, Divider, Typography } from "antd";
import UploadProject from "../ui/UploadProject";
import { loadAsync } from "jszip";
import { RcFile } from "antd/es/upload";
import { parseProject } from "catfix-utils/dist";

import { ScratchProject } from "catfix-utils/dist/scratch";
import { Project } from "catfix-utils/dist/parsedProject";
import Loader from "../ui/Loader";
import { useTranslation } from "react-i18next";
import URLLoader from "../ui/URLLoader";
import { FileOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import { basicAnimations } from "../../utils/animations";
import GradesContainer from "../grades/GradesContainer";
import ScanContainer from "../tips/ScanContainer";

// статусы загрузки файла
type fileStatus = "loading" | "loaded";

function MainPage() {
    // json со структурой проекта
    const [projectJSON, setProjectJSON] = useState<ScratchProject | null>(null);
    const [project, setProject] = useState<Project | null>(null);
    const [uploadState, setUploadState] = useState<fileStatus>("loaded");
    const [fileName, setFileName] = useState<string | null>("-");

    const [messageApi, contextHolder] = message.useMessage();
    const { t } = useTranslation();

    const handleUpload = (project: RcFile, projects: RcFile[]) => {
        /**
         * Обработка загруженного файла. Архив распаковывается, из него извлекается
         * project.json и сохраняется в state-переменную projectJSON
         */
        // сбрасываем json
        setProjectJSON(() => {
            return null;
        });

        // сбрасываем имя файла
        setFileName("-");

        // началась загрузка файла
        setUploadState("loading");

        // распаковываем архив
        loadAsync(project)
            .then(function (content) {
                return content.files["project.json"].async("text");
            })
            .then(function (txt) {
                const projectJSON: ScratchProject = JSON.parse(txt);
                // сохраняем json с проектом в стейт
                setProjectJSON(projectJSON);
                // сохраняем имя файла в стейт
                setFileName(project.name);
            })
            .catch(function (error) {
                // вывод сообщения в случае, если загрузили НЕ scratch файл
                messageApi.open({
                    type: "error",
                    content: t("ui.uploadError"),
                });
            })
            .finally(function () {
                // в любом случае меняем статус загрузки файла на "завершённый"
                setUploadState("loaded");
            });
    };

    const handleURLUpload = (
        project: ScratchProject | null,
        projectName: string | null
    ) => {
        setFileName(projectName);
        setProjectJSON(project);
    };

    useEffect(() => {
        // преобразование входного проекта в удобный для обработки формат
        if (projectJSON) {
            try {
                const project: Project = parseProject(projectJSON);
                setProject(project);
                messageApi.open({
                    type: "success",
                    content: t("ui.uploadFinished"),
                });
                console.log("project json ", projectJSON);
                console.log("parsed project", project);
            } catch (e) {
                messageApi.open({
                    type: "error",
                    content: t("ui.parsingError"),
                });
                console.error("Парсинг проекта завершился ошибкой: ", e);
            }
        } else {
            setProject(null);
        }
    }, [projectJSON]);

    return (
        <>
            {contextHolder}
            <motion.div
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={basicAnimations}
            >
                <Card style={{ marginBottom: 16, backgroundColor: "#D7E5CA" }}>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Typography.Title>
                                {t("ui.maiPageTitle")}
                            </Typography.Title>
                            <Typography.Paragraph>
                                {t("ui.mainPageDesc")}
                            </Typography.Paragraph>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col sm={24} lg={12}>
                            <UploadProject
                                multiple={false}
                                onUpload={handleUpload}
                            />
                        </Col>
                        <Col sm={24} lg={12}>
                            <URLLoader onUpload={handleURLUpload} />
                        </Col>
                    </Row>
                    <Divider />
                    <Row gutter={16}>
                        <Col span={24}>
                            <Typography.Title level={4}>
                                <FileOutlined />{" "}
                                {t("ui.fileName", { fileName: fileName })}
                            </Typography.Title>
                            {uploadState === "loading" && <Loader />}
                        </Col>
                    </Row>
                </Card>
            </motion.div>
            <Row gutter={16}>
                <Col sm={24} lg={12}>
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={basicAnimations}
                        transition={{ delay: 0.8 }}
                    >
                        {uploadState === "loaded" && (
                            <GradesContainer project={project} />
                        )}
                    </motion.div>
                </Col>
                <Col sm={24} lg={12}>
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={basicAnimations}
                        transition={{ delay: 0.8 }}
                    >
                        {uploadState === "loaded" && (
                            <ScanContainer
                                project={project}
                                projectJSON={projectJSON}
                            />
                        )}
                    </motion.div>
                </Col>
            </Row>
        </>
    );
}

export default MainPage;
