/**
 * Компонент предназначен для загрузки проекта через URL
 */

import react, { useState } from "react";
import { Button, Card, Form, Input } from "antd";
import { ScratchProject } from "../../@types/scratch";
import { useTranslation } from "react-i18next";

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

    /**
     * Получение json-проекта
     * @param projectId идентификатор проекта
     */
    const loadProject = async (projectId: number) => {
        /**
         * Код загрузки json-проекта взят с этой страницы:
         * https://apple502j.github.io/parse-sb3-blocks/demo.html
         */

        setIsLoading(true); // загрузка запущена

        try {
            // запрашиваем токен доступа и название проекта
            const tokenResp = await fetch(
                `https://trampoline.turbowarp.org/proxy/projects/${projectId}`
            );

            let token;
            let projectName = null;
            if (tokenResp.ok) {
                const tokenData = await tokenResp.json();
                token = `&token=${tokenData.project_token}`;
                projectName = tokenData.title;
            }

            const resp = await fetch(
                `https://projects.scratch.mit.edu/${projectId}/?${Date.now()}${token}`
            );
            const projectData = await resp.json();

            onUpload(projectData, projectName);
        } catch (e) {
            onUpload(null, null);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSend = (values: formData) => {
        // можно было и понятнее записать, но тут берём из URL цифры в конце
        const projectId = Number(
            values.url.replace(/\//g, " ").trimEnd().split(" ").slice(-1)
        );

        loadProject(projectId);
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
                            message: "Введи адрес проекта",
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        size={"middle"}
                        loading={isLoading}
                    >
                        Загрузить
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
}

export default URLLoader;
