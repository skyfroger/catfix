import react, { useEffect, useState } from "react";
import { Card } from "antd";
import MassURLLoader from "./MassURLLoader";
import ProjectsDataTable, { TableData } from "./ProjectsDataTable";
import { APIResponce } from "../utils/httpAPI";
import parseProject from "../utils";
import grader, { getTotalGrade } from "../graders";
import { Tip } from "../scaners/types";
import { scanForErrors, scanForWarnings } from "../scaners";

function TeacherPage() {
    const [projectsData, setProjectsData] = useState<APIResponce[]>([]);
    const [tableData, setTableData] = useState<TableData[]>([]);

    /**
     * Сохранение в state массива проектов
     * @param projects
     */
    const handleURLUpload = (projects: APIResponce[]) => {
        setProjectsData(projects);
    };

    useEffect(() => {
        // как только получены новые проекты, нужно их парсить, оценить
        // и получить список советов

        const tableData: TableData[] = [];

        // перебираем загруженные проекты
        projectsData.forEach((project, index) => {
            // парсим проект
            const parsedProject = parseProject(project.projectJSON);
            // оцениваем проект
            const grades = grader(parsedProject);

            // суммарная оценка
            const totalGrade = getTotalGrade(grades);

            // получаем массив советов (ошибок и предупреждений)
            const tips: Tip[] = [
                ...scanForErrors(parsedProject, project.projectJSON),
                ...scanForWarnings(parsedProject, project.projectJSON),
            ];

            // сохраняем данные для строки в таблице
            tableData.push({
                key: index,
                projectName: project.projectName,
                projectAuthor: project.projectAuthor,
                grades: grades,
                tips: tips,
                totalGrade: totalGrade,
            });
        });

        // меняем state
        setTableData(tableData);
    }, [projectsData]);

    return (
        <>
            <Card style={{ marginBottom: 16 }}>
                <MassURLLoader onUpload={handleURLUpload} />
            </Card>
            <Card style={{ marginBottom: 16 }}>
                <ProjectsDataTable data={tableData} />
            </Card>
        </>
    );
}

export default TeacherPage;
