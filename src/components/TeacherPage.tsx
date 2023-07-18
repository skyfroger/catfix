import react, { useState } from "react";
import { Card } from "antd";
import MassURLLoader from "./MassURLLoader";
import ProjectsDataTable from "./ProjectsDataTable";
import { APIResponce } from "../utils/httpAPI";
function TeacherPage() {
    const [projectsData, setProjectsData] = useState<APIResponce[]>([]);

    /**
     * Сохранение в state массива проектов
     * @param projects
     */
    const handleURLUpload = (projects: APIResponce[]) => {
        console.log(projects);
        setProjectsData(projects);
    };

    return (
        <>
            <Card style={{ marginBottom: 16 }}>
                <MassURLLoader onUpload={handleURLUpload} />
            </Card>
            <Card style={{ marginBottom: 16 }}>
                <ProjectsDataTable />
            </Card>
        </>
    );
}

export default TeacherPage;
