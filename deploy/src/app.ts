import { listObjects, downloadFiles, uploadFiles } from './functions/aws';
import { popFromQueue } from './functions/queue';
import { buildProject } from './functions/build';
import path from 'path';

async function main() {
    while (true) {
        const projectId = await popFromQueue();
        if (!projectId) continue;
        
        try {
            const listofFiles = await listObjects(projectId);
            await downloadFiles(listofFiles, `../build/${projectId}`);
            const projectPath = path.join(__dirname, `../build/${projectId}`);
            const res = await buildProject(projectPath);
            console.log('Build result:', res);
            await uploadFiles(`../output/${projectId}`, projectId);
        } catch (error) {
            console.error('Error during the build process:', error);
        }
    }
}

main();
