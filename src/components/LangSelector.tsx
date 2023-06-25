/**
 * Временный компонент. Нужен для смены языка интерфейса.
 */

import React from "react";
import { Radio } from "antd";
import { useTranslation } from "react-i18next";

function LangSelector() {
    const { t, i18n } = useTranslation();
    const handleLangChange = (lang: string) => {
        i18n.changeLanguage(lang);
    };
    return (
        <>
            <Radio.Group>
                <Radio.Button
                    onClick={() => {
                        handleLangChange("ru");
                    }}
                >
                    Русский
                </Radio.Button>
                <Radio.Button
                    onClick={() => {
                        handleLangChange("by");
                    }}
                >
                    Белоруский
                </Radio.Button>
            </Radio.Group>
        </>
    );
}

export default LangSelector;
