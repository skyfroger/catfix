/**
 * Вывод предупреждения или ошибки
 */

import React from "react";
import { useTranslation } from "react-i18next";
import { WarningFilled, BugFilled } from "@ant-design/icons";
import { Tip } from "../scaners/types";
import { Col, Divider, Row, Space } from "antd";
import parse from "html-react-parser";
import ScratchCode from "./ScratchCode";

function TipItem({ type, message, payload, code, title }: Tip) {
    const { t } = useTranslation();

    const color = type === "warning" ? "#F7D060" : "#FF6D60";

    return (
        <>
            <Divider>{t(title)}</Divider>
            <Space direction={"horizontal"}>
                <p style={{ fontSize: 32, color: color }}>
                    {type === "warning" ? <WarningFilled /> : <BugFilled />}
                </p>
                <p>{parse(t(message, { ...payload }))}</p>
                <div>{code && <ScratchCode code={code} />}</div>
            </Space>
        </>
    );
}

export default TipItem;
