import React from "react";
import { Spin, Col, Row } from "antd";
import { useTranslation } from "react-i18next";

function Loader() {
    const { t } = useTranslation();

    return (
        <Row justify={"center"}>
            <Col>
                <span>{t("ui.loading")}</span> <Spin />
            </Col>
        </Row>
    );
}

export default Loader;
