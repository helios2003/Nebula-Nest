import { listObjects, downloadFiles, uploadFiles } from "./functions/aws";
import { popFromQueue } from "./functions/queue";
import { buildProject } from "./functions/build";
import path from "path";
import fs from "fs";

let isRunning = false;

async function main() {
    if (isRunning) return;
    isRunning = true;
    const projectId = await popFromQueue();
    console.log("Project id is", projectId);
    if (!projectId) {
        isRunning = false;
        return;
    }

    try {
        const listofFiles = await listObjects(`output/${projectId}`);
        const removePrefix = `output/${projectId}`;
        await downloadFiles(listofFiles, `../build/${projectId}`, removePrefix);
        await buildProject(projectId);
        console.log("Built successfully");
        //await uploadFiles(`../build/${projectId}`, projectId);
    } catch (error) {
        console.error("Error during the build process:", error);
    }
    isRunning = false;
}
setInterval(main, 10000);
