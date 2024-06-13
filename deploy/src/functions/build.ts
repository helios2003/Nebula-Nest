import { exec } from 'child_process';
import path from 'path';

export async function buildProject(projectId: string) {
    const dockerFile = path.resolve(__dirname, '..', '..', 'Dockerfile');
    const buildFile = path.resolve(__dirname, '..', '..', 'build.sh');
    const projectDir = path.resolve(__dirname, '..', '..', '..', 'build', projectId);

    console.log('Dockerfile path', dockerFile);
    console.log("building shell script", buildFile);
    console.log("project id path", projectDir);

    return new Promise((resolve, reject) => {
        exec(`bash "${buildFile}" "${dockerFile}" "${projectDir}"`, (error, stdout, stderr) => {
            if (error) {
                reject(`Error: ${error.message}`);
                return;
            }
            if (stderr) {
                reject(`stderr: ${stderr}`);
                return;
            }
            resolve(stdout.trim());
        });
    }).catch(Error => {
        console.log(Error);
    });
}