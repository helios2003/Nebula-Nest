import { listObjects, downloadFiles, uploadFiles } from "./functions/aws";
import { popFromQueue } from "./functions/queue";
import { buildProject } from "./functions/build";
import { PrismaClient } from '../../db/node_modules/.prisma/client'

let isRunning = false;
const prisma = new PrismaClient();

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

        // DB query
        const project = await prisma.projects.findUnique({
            where: {
                id: projectId
            }
        });
        if (!project) {
            console.log("Project not found");
            return;
        }
        const frontendDir = project.dir;
        const installCommand = project.install;
        const buildCommand = project.build;
        const outputDir = project.output;
        // Build the project
        await buildProject({ projectId, frontendDir, installCommand, buildCommand, outputDir});
        console.log("Built successfully");
        await uploadFiles(`../build/${projectId}/dist`, projectId);
    } catch (error) {
        console.error("Error during the build process:", error);
    }
    isRunning = false;
}

// poll the queue at the interval of 10 seconds
setInterval(main, 10000);
