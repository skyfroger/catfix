/**
 * Вывод предупреждения или ошибки
 */

import React from "react";
import { useTranslation } from "react-i18next";
import { WarningFilled, BugFilled } from "@ant-design/icons";
import { Tip } from "../scaners/types";
import { Col, Row, Space } from "antd";
import parse from "html-react-parser";
import ScratchCode from "./ScratchCode";

function TipItem({ type, message, payload, code }: Tip) {
    const { t } = useTranslation();

    const color = type === "warning" ? "#F7D060" : "#FF6D60";

    return (
        <>
            <Row>
                <Col span={24}>
                    <Space direction={"horizontal"}>
                        <p style={{ fontSize: 32, color: color }}>
                            {type === "warning" ? (
                                <WarningFilled />
                            ) : (
                                <BugFilled />
                            )}
                        </p>
                        <p>{parse(t(message, { ...payload }))}</p>
                        <p>{code && <ScratchCode code={code} />}</p>
                    </Space>
                </Col>
            </Row>
        </>
    );
}

export default TipItem;
