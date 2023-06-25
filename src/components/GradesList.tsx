/**
 * Вывод списка оценок проекта по ряду критериев.
 */

import React, { useState } from "react";
import {ScratchProject, Target} from "../../@types/scratch";
import { toScratchblocks } from "parse-sb3-blocks/dist/parse-sb3-blocks.module";

interface gradesListProps {
    project: ScratchProject | undefined;
}

function GradesList({ project }: gradesListProps) {

    console.log(project);
    let whenGreenflag: string[];
    let scripts: string[] = [];
    if (project !== undefined) {
        const stage = project.targets.filter((t: Target) => !t.isStage)[0];
        console.log(stage);
        whenGreenflag = Object.keys(stage.blocks).filter(
            (key) => stage.blocks[key].opcode === "event_whenflagclicked"
        );
        whenGreenflag.forEach((cap)=>{
            scripts.push(toScratchblocks(cap, stage.blocks, "en", {
                tab: "  ",
                variableStyle: "always"
            }))
        })

    }

    return (
        <div>
            {scripts.map((item, index)=>{
                return (<pre key={index}>{item}</pre>)
            })}
        </div>
    );
}

export default GradesList;
