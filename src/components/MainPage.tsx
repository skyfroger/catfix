/**
 * Главная страница приложения, на которой располагается форма загрузки файла с проектом,
 * список оценок и рекомендаций по устранению ошибок.
 */

import React, { useState } from "react";
import UploadProject from "./UploadProject";
import { loadAsync } from "jszip";
import { RcFile } from "antd/es/upload";
import GradesList from "./GradesList";

function MainPage() {
    // json со структурой проекта
    const [projectJSON, setProjectJSON] = useState<JSON>({} as JSON);

    const handleUpload = (project: RcFile) => {
        /**
         * Обработка загруженного файла. Архив распаковывается, из него извлекается
         * project.json и сохраняется в state-переменную projectJSON
         */
        loadAsync(project)
            .then(function (content) {
                console.log("loading project file");
                return content.files["project.json"].async("text");
            })
            .then(function (txt) {
                console.log("archive loaded.");
                const projectJSON = JSON.parse(txt);
                console.log(projectJSON);
                setProjectJSON(projectJSON);
            })
            .catch(function (error) {
                console.log("error while uploading project");
            });
    };

    return (
        <>
            <UploadProject onUpload={handleUpload} />
            <GradesList project={projectJSON} />
        </>
    );
}

export default MainPage;
