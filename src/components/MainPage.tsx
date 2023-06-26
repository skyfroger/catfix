/**
 * Главная страница приложения, на которой располагается форма загрузки файла с проектом,
 * список оценок и рекомендаций по устранению ошибок.
 */

import React, { useState, useEffect } from "react";
import UploadProject from "./UploadProject";
import { loadAsync } from "jszip";
import { RcFile } from "antd/es/upload";
import GradesList from "./GradesList";
import parseProject from "../utils";

import {ScratchProject} from "../../@types/scratch";
import {Project} from "../../@types/parsedProject";

function MainPage() {
    // json со структурой проекта
    const [projectJSON, setProjectJSON] = useState<ScratchProject|undefined>(undefined);
    const [project, setProject] = useState<Project>()

    const handleUpload = (project: RcFile) => {
        /**
         * Обработка загруженного файла. Архив распаковывается, из него извлекается
         * project.json и сохраняется в state-переменную projectJSON
         */

        // сбрасываем json
        setProjectJSON(() => {
            return undefined;
        });

        // распаковываем архив
        loadAsync(project)
            .then(function (content) {
                return content.files["project.json"].async("text");
            })
            .then(function (txt) {
                const projectJSON: ScratchProject = JSON.parse(txt);
                setProjectJSON(projectJSON);
            })
            .catch(function (error) {
                console.log("error while uploading project");
            });
    };

    useEffect(()=>{
        // преобразование входного проекта в удобный для обработки формат
        if (projectJSON) {
            const project: Project = parseProject(projectJSON)
            setProject(project)
            console.log(project);
        }

    }, [projectJSON]);

    return (
        <>
            <UploadProject onUpload={handleUpload} />
            <GradesList project={project} />
        </>
    );
}

export default MainPage;
