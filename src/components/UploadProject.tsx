/**
 * Форма для загрузки файла с проектом.
 * В этом компоненте архив с проектом передаётся в компонент MainPage.
 */

import React from "react";
import { InboxOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { Upload } from "antd";

import { RcFile } from "antd/es/upload";

const { Dragger } = Upload;

interface uploadProjectProps {
    onUpload: (projectJson: RcFile) => void;
}

function UploadProject({ onUpload }: uploadProjectProps) {
    const uploadProps: UploadProps = {
        name: "file",
        multiple: false,
        showUploadList: true,
        maxCount: 1,
        action: "",
        beforeUpload(file: RcFile, FileList: RcFile[]) {
            console.log("file type", file.type);
            onUpload(file);

            return false;
        },
    };
    return (
        <Dragger {...uploadProps}>
            <p className="ant-upload-drag-icon">
                <InboxOutlined />
            </p>
            <p className="ant-upload-text">
                Щёлкни или перетащи сюда файл с проектом, который хочешь
                проверить
            </p>
        </Dragger>
    );
}

export default UploadProject;
