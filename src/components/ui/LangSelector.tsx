/**
 * Временный компонент. Нужен для смены языка интерфейса.
 */

import React from "react";
import { Radio, Select, Space } from "antd";
import { GlobalOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

function LangSelector() {
    const { t, i18n } = useTranslation();
    const handleLangChange = (value: string) => {
        i18n.changeLanguage(value);
    };
    return (
        <div>
            <Space>
                <GlobalOutlined style={{ color: "#4C4C6D", fontSize: 20 }} />
                <Select
                    defaultValue="ru"
                    style={{ width: 130 }}
                    onChange={handleLangChange}
                    value={i18n.language}
                    options={[
                        { value: "ru", label: "Русский" },
                        { value: "be", label: "Беларуская" },
                        { value: "en", label: "English" },
                    ]}
                />
            </Space>
        </div>
    );
}

export default LangSelector;
