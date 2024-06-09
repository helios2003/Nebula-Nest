import { exec } from 'child_process';
import path from 'path';

export async function buildProject(projectId: string) {
    const dockerFileDir = path.resolve(__dirname, '..');
    const filesParentDir = path.resolve(__dirname, '..', '..', '..', projectId);
    const buildShellScript = path.join(dockerFileDir, 'Dockerfile');
    exec(`./build.sh ${buildShellScript} ${filesParentDir}`);
}
