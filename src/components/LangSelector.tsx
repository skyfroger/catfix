/**
 * Временный компонент. Нужен для смены языка интерфейса.
 */

import React from "react";
import { Radio, Select } from "antd";
import { useTranslation } from "react-i18next";

function LangSelector() {
    const { t, i18n } = useTranslation();
    const handleLangChange = (value: string) => {
        i18n.changeLanguage(value);
    };
    return (
        <>
            <Select
                defaultValue="ru"
                style={{ width: 120 }}
                onChange={handleLangChange}
                options={[
                    { value: 'ru', label: 'Русский' },
                    { value: 'by', label: 'Беларуская' },
                ]}
            />
        </>
    );
}

export default LangSelector;
