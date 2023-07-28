/**
 * API для доступа к онлайн-версии проекта
 */

import { ScratchProject } from "catfix-utils/dist/scratch";
import hash from "object-hash";

export type APIResponce = {
    key: string;
    projectJSON: ScratchProject;
    projectName: string;
    projectAuthor: string;
};

export const projectAPI = {
    /**
     * Получаем информацию о проекте: JSON, название проекта, имя учётной записи
     * @param projectId идентификатор проекта
     */
    async get(projectId: number): Promise<APIResponce> {
        const tokenResp = await fetch(
            `https://trampoline.turbowarp.org/proxy/projects/${projectId}`
        );
        let token;
        let projectName = null;
        let projectAuthor = "-";

        if (tokenResp.ok) {
            const tokenData = await tokenResp.json();
            token = `&token=${tokenData.project_token}`;
            projectName = tokenData.title; // получаем название проекта
            projectAuthor = tokenData.author.username; // получаем имя пользователя
        }

        const resp = await fetch(
            `https://projects.scratch.mit.edu/${projectId}/?${Date.now()}${token}`
        );

        const projectJSON = await resp.json();

        // ключ - это хэш json-объекта с проектом
        // таким образом удостоверимся, что все проекты в таблице будут уникальными
        return {
            key: hash.sha1(projectJSON),
            projectJSON: projectJSON,
            projectName: projectName,
            projectAuthor: projectAuthor,
        };
    },
};

export default projectAPI;
