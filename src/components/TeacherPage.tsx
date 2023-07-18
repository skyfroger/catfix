import react from "react";
import { Card, Col, message, Row, Space } from "antd";
import MassURLLoader from "./MassURLLoader";
import ProjectsDataTable from "./ProjectsDataTable";
function TeacherPage() {
    return (
        <>
            <Card style={{ marginBottom: 16 }}>
                <MassURLLoader />
            </Card>
            <Card style={{ marginBottom: 16 }}>
                <ProjectsDataTable />
            </Card>
        </>
    );
}

export default TeacherPage;
