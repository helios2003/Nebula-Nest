import { exec } from 'child_process';
import path from 'path';

export async function getRepoSize(username: string, projectName: string): Promise<string> {
    //const topLevelDir = path.resolve(''[Sy)
    const shellPath = path.resolve(__dirname, '..', '..', 'clone.sh');
    console.log("shell script path is: ", shellPath);
    return new Promise((resolve, reject) => {
        exec(`bash "${shellPath}" "${username}" "${projectName}"`, (error, stdout, stderr) => {
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
    });
}
