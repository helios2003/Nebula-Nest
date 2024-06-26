import { Router } from 'express'
import { simpleGit, SimpleGit } from 'simple-git'
import { v4 as uuidv4 } from "uuid"
import { uploadToS3 } from '../functions/aws';
import { pushToQueue } from '../functions/queue';
import { getRepoSize } from '../functions/utils';
import { exec } from 'child_process';
import path from 'path'
import fs from 'fs'
import { configurationSchema } from '../zod/validate';
import { PrismaClient } from '../../../db/node_modules/.prisma/client'

const uploadRouter = Router()
const prisma = new PrismaClient()

uploadRouter.post('/upload', async (req, res) => {
    const inputURL = req.body;
    try {
        const urlResult = configurationSchema.safeParse(inputURL);

        if (urlResult.success === false) {
            res.status(403).json({
                msg: "Invalid input"
            })
        } else {
            // get the necessary data required to clone the project
            const repoURL = urlResult.data.url;
            const splitURL = repoURL.split('/')
            const len = splitURL.length
            const username = splitURL[len - 2]
            const projectName = splitURL[len - 1].replace('.git', '')

            const size = await getRepoSize(username, projectName);
            if (parseInt(size) > 1024 * 1024) {
                res.status(414).json({ "msg": "File size is too large "});
                return;
            }
            const git: SimpleGit = simpleGit();
            let uploadUUID: string = uuidv4().substring(0, 8);
            
            const shellPath = path.join(__dirname, 'clone.sh').replace(/\\/g, '/')
            
            // this command checks if the repository size is too large to be cloned or not
            exec(`cmd /c "${shellPath}" "${username}" "${projectName}"`);
            
            // stores the project configuration in the database
            await prisma.projects.create({
                data: {
                    id: uploadUUID,
                    url: repoURL,
                    dir: urlResult.data.directory,
                    install: urlResult.data.install,
                    build: urlResult.data.build,
                    output: urlResult.data.output,
                    logs: ''
                }
            });

            fs.mkdirSync(`../output/${uploadUUID}`, { recursive: true });
            await git.clone(repoURL, `../output/${uploadUUID}`);
            await uploadToS3(`../output/${uploadUUID}`, uploadUUID);
            await pushToQueue(uploadUUID);
            fs.rmdirSync(`../output/${uploadUUID}`, { recursive: true })
            // create the log file and add this entry
            fs.mkdirSync('../logs', { recursive: true });
            fs.appendFile(`../logs/${uploadUUID}.log`, `✔️ Cloned the project successfully and queued the deployment\n`, (err) => {
                if (err) throw err;
            });
            res.status(200).json({ 
                "id": uploadUUID
            });
        }
    } catch (err) {
        console.error(err)
        res.status(500).json({
            msg: "Oops, there is an error from our side"
        })
    }
})

export { uploadRouter }
