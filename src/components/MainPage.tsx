/**
 * Главная страница приложения, на которой располагается форма загрузки файла с проектом,
 * список оценок и рекомендаций по устранению ошибок.
 */

import React, { useState, useEffect } from "react";
import { Card, Col, message, Row } from "antd";
import UploadProject from "./UploadProject";
import { loadAsync } from "jszip";
import { RcFile } from "antd/es/upload";
import GradesList from "./GradesList";
import parseProject from "../utils";

import { ScratchProject } from "../../@types/scratch";
import { Project } from "../../@types/parsedProject";
import Loader from "./Loader";
import { useTranslation } from "react-i18next";
import ScanResultsList from "./ScanResultsList";

// статусы загрузки файла
type fileStatus = "loading" | "loaded";

function MainPage() {
    // json со структурой проекта
    const [projectJSON, setProjectJSON] = useState<ScratchProject | null>(null);
    const [project, setProject] = useState<Project | null>(null);
    const [uploadState, setUploadState] = useState<fileStatus>("loaded");
    const [fileName, setFileName] = useState<string | null>(null);

    const [messageApi, contextHolder] = message.useMessage();
    const { t } = useTranslation();

    const handleUpload = (project: RcFile) => {
        /**
         * Обработка загруженного файла. Архив распаковывается, из него извлекается
         * project.json и сохраняется в state-переменную projectJSON
         */

        // сбрасываем json
        setProjectJSON(() => {
            return null;
        });

        // сбрасываем имя файла
        setFileName(null);

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
                messageApi.open({
                    type: "success",
                    content: t("ui.uploadFinished"),
                });
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

    useEffect(() => {
        // преобразование входного проекта в удобный для обработки формат
        if (projectJSON) {
            const project: Project = parseProject(projectJSON);
            setProject(project);
            console.log("project json ", projectJSON);
            console.log("parsed project", project);
        } else {
            setProject(null);
        }
    }, [projectJSON]);

    return (
        <>
            {" "}
            <Row>
                <Col span={24}>
                    {contextHolder}
                    <Card style={{ margin: 16 }}>
                        <UploadProject onUpload={handleUpload} />
                        {uploadState === "loading" && <Loader />}
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col sm={24} lg={12}>
                    <div style={{ margin: 16 }}>
                        {uploadState === "loaded" && (
                            <GradesList fileName={fileName} project={project} />
                        )}
                    </div>
                </Col>
                <Col sm={24} lg={12}>
                    <div style={{ margin: 16 }}>
                        {uploadState === "loaded" && (
                            <ScanResultsList
                                fileName={fileName}
                                project={project}
                                projectJSON={projectJSON}
                            />
                        )}
                    </div>
                </Col>
            </Row>
        </>
    );
}

export default MainPage;
