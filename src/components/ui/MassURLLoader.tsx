/**
 * Компонент для массовой загрузки проектов по их URL
 */

import react, { useState } from "react";
import { Button, Card, Form, Input, Typography } from "antd";
import { useTranslation } from "react-i18next";
import projectAPI, { APIResponce } from "../../utils/httpAPI";
const { TextArea } = Input;

// максимальное количество проектов, которое можно проверить за 1 запрос
const IDS_LIMIT = 20;

interface formData {
    urls: string;
}

// пропсы компонента
interface massUrlLoaderProps {
    onUpload: (projects: APIResponce[]) => void;
}

function MassURLLoader({ onUpload }: massUrlLoaderProps) {
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false);

    const handleSend = (values: formData) => {
        const urls = values.urls;
        const uniqIds = new Set(
            Array.from(urls.matchAll(/\d{4,}/g)).map((m) => Number(m[0]))
        );

        // массив загруженных проектов
        const projects: APIResponce[] = [];

        /**
         * Функция загрузки информации о нескольких проектах
         * @param projectIds список уникальных id
         */
        async function load(projectIds: Set<number>) {
            setIsLoading(true); // загрузка началась

            // перебираем массив id
            for (const id of Array.from(projectIds).slice(0, IDS_LIMIT)) {
                try {
                    // запрашиваем информацию о проекте
                    const projectData: APIResponce = await projectAPI.get(id);
                    // добавляем к массиву проектов, если нет ошибок
                    projects.push(projectData);
                } catch (e) {}
            }

            // передаём массив проектов в главный компонент
            onUpload(projects);

            // загрузка завершена
            setIsLoading(false);
        }

        // загружаем каждый проект
        load(uniqIds);
    };

    return (
        <div style={{ display: "flex", gap: "8px", flexDirection: "column" }}>
            <Typography.Title level={4}>
                {t("ui.massUploadFromURL")}
            </Typography.Title>
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSend}
                autoComplete="off"
            >
                <Form.Item
                    name="urls"
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
                    <TextArea
                        allowClear
                        placeholder={t("ui.massURLUploadHint", {
                            maxNumberOfLinks: IDS_LIMIT,
                        })}
                        autoSize={{ minRows: 5, maxRows: 5 }}
                    />
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

export default MassURLLoader;
