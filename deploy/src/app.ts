import { listObjects, downloadFiles, uploadFiles } from './functions/aws';
import { popFromQueue } from './functions/queue';
import { buildProject } from './functions/build';
import path from 'path';
import fs from 'fs';

async function main() {
    while (true) {
        const projectId = await popFromQueue();
        console.log("Project id is", projectId);
        if (!projectId) continue;
        
        try {
            const listofFiles = await listObjects(`output/${projectId}`);
            const removePrefix = `output/${projectId}`;
            await downloadFiles(listofFiles, `../build/${projectId}`, removePrefix);
            const projectPath = path.join(__dirname, `../build/${projectId}`);
            
            //const res = await buildProject(projectPath);
            //console.log('Build result:', res);
            await uploadFiles(`../build/${projectId}`, projectId);
        } catch (error) {
            console.error('Error during the build process:', error);
        }
    }
}

main();
