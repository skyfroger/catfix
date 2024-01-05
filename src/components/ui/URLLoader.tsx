/**
 * Компонент предназначен для загрузки проекта через URL
 */

import react, { useState } from "react";
import { Button, Form, Input, Typography } from "antd";
import { ScratchProject } from "catfix-utils/dist/scratch";
import { useTranslation } from "react-i18next";
import projectAPI from "../../utils/httpAPI";

interface formData {
    url: string;
}

interface urlLoaderProps {
    onUpload: (
        project: ScratchProject | null,
        projectName: string | null
    ) => void;
}

function URLLoader({ onUpload }: urlLoaderProps) {
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false);

    const { t } = useTranslation();

    const handleSend = (values: formData) => {
        // ищем id проекта в url
        const match = values.url.match(/\d{4,}/);
        const projectId = match ? Number(match[0]) : 0;

        async function load(projectId: number) {
            setIsLoading(true); // загрузка запущена
            try {
                const { projectJSON, projectName, projectAuthor } =
                    await projectAPI.get(projectId);
                onUpload(projectJSON, projectName);
            } catch (e) {
                onUpload(null, null);
            } finally {
                setIsLoading(false); // загрузка остановлена
            }
        }

        load(projectId);
    };

    return (
        <div style={{ display: "flex", gap: "8px", flexDirection: "column" }}>
            <Typography.Title level={4}>
                {t("ui.uploadFromURL")}
            </Typography.Title>
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSend}
                autoComplete="off"
                style={{ width: "100%" }}
            >
                <Form.Item
                    name="url"
                    label={t("ui.urlLabel")}
                    rules={[
                        { required: true, message: t("ui.urlRequired") },
                        {
                            pattern:
                                /https?:\/\/scratch.mit.edu\/projects\/(\d){4,}\/?/,
                            message: t("ui.projectURLRequired"),
                        },
                    ]}
                >
                    <Input allowClear />
                </Form.Item>
                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        size={"middle"}
                        loading={isLoading}
                    >
                        {t("ui.loadFromURLButton")}
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default URLLoader;
