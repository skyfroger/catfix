/**
 * Вывод предупреждения или ошибки
 */

import React from "react";
import { useTranslation } from "react-i18next";
import { WarningFilled, BugFilled } from "@ant-design/icons";
import { Tip } from "catfix-utils/dist/scaners/types";
import { Divider, Space } from "antd";
import parse from "html-react-parser";
import ScratchCode from "../ui/ScratchCode";
import { motion } from "framer-motion";
import { basicAnimations } from "../../utils/animations";

function TipItem({ type, message, payload, code, title }: Tip) {
    const { t } = useTranslation();

    const color = type === "warning" ? "#F7D060" : "#FF6D60";

    return (
        <motion.div
            style={{ overflow: "auto" }}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={basicAnimations}
            transition={{ duration: 0.5 }}
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
