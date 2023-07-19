/**
 * Кнопка с подтверждением действия
 */

import react, { ReactElement } from "react";
import { Button, Popconfirm } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";

interface deleteButtonProps {
    children: ReactElement;
    onConfirm: () => void;
}

function DeleteConfirmButton({ children, onConfirm }: deleteButtonProps) {
    const { t } = useTranslation();
    return (
        <Popconfirm
            title={t("ui.deleteTitle")}
            description={t("ui.deleteConfirm")}
            okText={t("ui.ok")}
            cancelText={t("ui.cancel")}
            onConfirm={onConfirm}
        >
            <Button style={{ color: "#FF6D60" }} type="dashed" danger>
                {children}
            </Button>
        </Popconfirm>
    );
}

export default DeleteConfirmButton;
