import { exec } from 'child_process';
import path from 'path';

export function buildProject(projectId: string) {
    const dockerFileDir = path.resolve(__dirname, '..', '..');
    const filesParentDir = path.resolve(__dirname, '..', '..', '..', 'build', projectId);
    const buildShellScript = path.join(dockerFileDir, 'Dockerfile');
    console.log("building shell script", buildShellScript);
    console.log("project id path", filesParentDir);
    exec(`bash ./build.sh "${buildShellScript}" "${filesParentDir}"`);
}
