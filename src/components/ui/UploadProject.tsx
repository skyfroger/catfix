/**
 * Форма для загрузки файла с проектом.
 * В этом компоненте архив или массив архивов передаётся для дальнейшей обработки.
 * Проп multiple определяет 1 или несколько проектов можно будет загрузить.
 */

import React from "react";
import { useTranslation } from "react-i18next";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { Upload, Card } from "antd";

import { RcFile } from "antd/es/upload";

const { Dragger } = Upload;

interface uploadProjectProps {
    multiple: boolean;
    onUpload: (projectJson: RcFile, projects: RcFile[]) => void;
}

function UploadProject({ multiple, onUpload }: uploadProjectProps) {
    const { t } = useTranslation();

    const uploadProps: UploadProps = {
        name: "file",
        multiple: multiple,
        showUploadList: false,
        maxCount: 1,
        action: "",
        accept: ".sb3",
        beforeUpload(file: RcFile, fileList: RcFile[]) {
            onUpload(file, fileList);
            return false; // отменяем загрузку файла
        },
    };
    return (
        <Card
            title={
                multiple ? t("ui.massUploadFromFile") : t("ui.uploadFromFile")
            }
        >
            <Dragger {...uploadProps}>
                <p className="ant-upload-drag-icon">
                    <UploadOutlined />{" "}
                </p>
                <p className="ant-upload-text">{t("ui.upload")}</p>
            </Dragger>
        </Card>
    );
}

export default UploadProject;
