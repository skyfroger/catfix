/**
 * Кнопка с подтверждением действия
 */

import react, { ReactElement } from "react";
import { Button, Popconfirm } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";

interface deleteButtonProps {
    children: ReactElement;
    disabled?: boolean;
    onConfirm: () => void;
}

function DeleteConfirmButton({
    children,
    onConfirm,
    disabled,
}: deleteButtonProps) {
    const { t } = useTranslation();
    return (
        <Popconfirm
            title={t("ui.deleteTitle")}
            description={t("ui.deleteConfirm")}
            okText={t("ui.ok")}
            cancelText={t("ui.cancel")}
            onConfirm={onConfirm}
        >
            <Button disabled={disabled} variant="dashed" color="danger">
                {children}
            </Button>
        </Popconfirm>
    );
}

export default DeleteConfirmButton;
