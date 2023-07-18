/**
 * Вывод подробной информации о проекте внутри таблицы
 */

import { Col, Row } from "antd";
import GradesList from "../grades/GradesList";
import ScanResultsList from "../tips/ScanResultsList";
import React from "react";
import { TableData } from "./ProjectsDataTable";

interface fullProjectInfoProps {
    data: TableData;
}

function FullProjectInfo({ data }: fullProjectInfoProps) {
    return (
        <>
            <Row>
                <Col span={24}>
                    <h2>{data.projectName}</h2>
                    <h4>{data.projectAuthor}</h4>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col sm={24} lg={12}>
                    <GradesList grades={data.grades} />
                </Col>
                <Col sm={24} lg={12}>
                    <ScanResultsList errorsWithWarnings={data.tips} />
                </Col>
            </Row>
        </>
    );
}

export default FullProjectInfo;
