/**
 * Форма для загрузки файла с проектом.
 * В этом компоненте архив с проектом передаётся в компонент MainPage.
 */

import React from "react";
import { useTranslation } from "react-i18next";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { Upload } from "antd";

import { RcFile } from "antd/es/upload";

const { Dragger } = Upload;

interface uploadProjectProps {
    onUpload: (projectJson: RcFile) => void;
}

function UploadProject({ onUpload }: uploadProjectProps) {
    const { t } = useTranslation();

    const uploadProps: UploadProps = {
        name: "file",
        multiple: false,
        showUploadList: false,
        maxCount: 1,
        action: "",
        beforeUpload(file: RcFile, FileList: RcFile[]) {
            onUpload(file);
            return false; // отменяем загрузку файла
        },
    };
    return (
        <>
            <p>{t("ui.uploadComment")}</p>
            <Dragger {...uploadProps}>
                <p className="ant-upload-drag-icon">
                    <UploadOutlined />{" "}
                </p>
                <p className="ant-upload-text">{t("ui.upload")}</p>
            </Dragger>
        </>
    );
}

export default UploadProject;
