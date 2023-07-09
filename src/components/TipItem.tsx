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
import { motion } from "framer-motion";

function TipItem({ type, message, payload, code, title }: Tip) {
    const { t } = useTranslation();

    const color = type === "warning" ? "#F7D060" : "#FF6D60";

    return (
        <motion.div
            style={{ overflow: "auto" }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            exit={{ opacity: 0, y: -10 }}
        >
            <Divider>{t(title)}</Divider>
            <Space direction={"horizontal"}>
                <p style={{ fontSize: 32, color: color }}>
                    {type === "warning" ? <WarningFilled /> : <BugFilled />}
                </p>
                <p>{parse(t(message, { ...payload }))}</p>
                <div>{code && <ScratchCode code={code} />}</div>
            </Space>
        </motion.div>
    );
}

export default TipItem;
