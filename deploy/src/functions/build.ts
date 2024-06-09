import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';

export async function buildProject(projectId: string): Promise<string> {
    const projectPath = path.join(__dirname, '..', '..', 'build', projectId);
    const dockerfilePath = path.join(__dirname, 'Dockerfile');  

    return new Promise((resolve, reject) => {
        const buildCommand = `docker build -t ${projectId} -f ${dockerfilePath} ${projectPath}`;
        console.log(buildCommand);
        const runCommand = `docker run --rm ${projectId}:latest`;

        exec(buildCommand, (buildError, buildStdout, buildStderr) => {
            if (buildError) {
                reject(new Error(`Docker build failed: ${buildStderr}`));
                return;
            }
            console.log('Docker build output:', buildStdout);

            exec(runCommand, (runError, runStdout, runStderr) => {
                if (runError) {
                    reject(new Error(`Docker run failed: ${runStderr}`));
                    return;
                }
                console.log('Docker run output:', runStdout);
                resolve('Build and run completed successfully');
            });
        });
    });
}
