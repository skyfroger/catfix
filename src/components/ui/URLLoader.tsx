/**
 * Компонент предназначен для загрузки проекта через URL
 */

import react, { useState } from "react";
import { Button, Card, Form, Input } from "antd";
import { ScratchProject } from "../../../@types/scratch";
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
        // можно было и понятнее записать, но тут берём из URL цифры в конце
        // todo брать из ссылки цифры с помощью RegEx
        const projectId = Number(
            values.url.replace(/\//g, " ").trimEnd().split(" ").slice(-1)
        );

        async function load(projectId: number) {
            setIsLoading(true); // загрузка запущена
            try {
                const { projectJSON, projectName, projectAuthor } =
                    await projectAPI.get(projectId);
                console.log(projectJSON, projectName, projectAuthor);
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
        <Card title={t("ui.uploadFromURL")}>
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSend}
                autoComplete="off"
            >
                <Form.Item
                    name="url"
                    label={t("ui.urlLabel")}
                    rules={[
                        { required: true, message: t("ui.urlRequired") },
                        {
                            pattern:
                                /https?:\/\/scratch.mit.edu\/projects\/(\d)+\/?/,
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
        </Card>
    );
}

export default URLLoader;
