import react from "react";
import { Card, Col, message, Row, Space } from "antd";
import React from "react";
import { categories, graderResult } from "../graders";
import { Tip } from "../scaners/types";
export interface TableData {
    key: React.Key;
    projectName: string;
    projectAuthor: string;
    totalGrade: number;
    grades: Map<categories, graderResult>;
    tips: Tip[];
}

interface propsDataTable {
    data: TableData[];
}
function ProjectsDataTable({ data }: propsDataTable) {
    console.log(data);
    return (
        <>
            <div>Таблица с результатами</div>
        </>
    );
}

export default ProjectsDataTable;
