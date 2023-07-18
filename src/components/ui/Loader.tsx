import React from "react";
import { Spin, Col, Row, Space } from "antd";
import { useTranslation } from "react-i18next";

function Loader() {
    const { t } = useTranslation();

    return (
        <Row justify={"center"}>
            <Col>
                <Space style={{ margin: 8 }}>
                    <span>{t("ui.loading")}</span> <Spin />
                </Space>
            </Col>
        </Row>
    );
}

export default Loader;
