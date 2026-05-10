import { Project } from "catfix-utils/dist/parsedProject";
import systemPromptMarkdown from "./system.md";

const systemPromptGenerator = () => {
    return systemPromptMarkdown;
};

const projectContentForPrompt = (project: Project) => {
    let prompt = "Project content\n";

    // сцена и спрайты в одном массиве
    const sprites = [project.stage, ...project.sprites];

    sprites.forEach((sprite) => {
        prompt += `
---

Sprite name: ${sprite.name}

Local vars: ${sprite.localVars};

Local lists: ${sprite.localLists};

Custom block names: ${sprite.customBlocks};

Sprite scripts:
${sprite.allScripts}
        `;
    });

    return prompt;
};

export { systemPromptGenerator, projectContentForPrompt };
