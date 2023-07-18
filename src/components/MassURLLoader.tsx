/**
 * Компонент для массовой загрузки проектов по их URL
 */

import react, { useState } from "react";
import { Button, Card, Col, Form, Input, message, Row, Space } from "antd";
import { useTranslation } from "react-i18next";

const { TextArea } = Input;

interface formData {
    urls: string;
}

function MassURLLoader() {
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false);

    const handleSend = (values: formData) => {
        const urls = values.urls;
        const uniqIds = new Set(
            Array.from(urls.matchAll(/\d{4,}/g)).map((m) => m[0])
        );

        console.log(uniqIds);
    };

    return (
        <Card title={"Загрузка нескольких онлайн-проектов"}>
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
        </Card>
    );
}

export default MassURLLoader;
