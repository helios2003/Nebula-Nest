import { Router } from 'express'
import { simpleGit, SimpleGit } from 'simple-git'
import { v4 as uuidv4 } from "uuid"
import { uploadToS3 } from '../functions/aws';
import { pushToQueue } from '../functions/queue';
import { getRepoSize } from '../functions/utils';
import { z } from 'zod'
import { exec } from 'child_process';
import path from 'path'
import fs from 'fs'
import WebSocket from 'ws';

const uploadRouter = Router()
const urlSchema = z.string().url().refine(url => url.startsWith('https://github.com') || url.startsWith('https://gitlab.com'));
const ws = new WebSocket('ws://localhost:8080');

ws.on('open', () => {
    console.log('WebSocket connection opened');
});
ws.on('error', (error) => {
    console.error('WebSocket error:', error);
});

uploadRouter.post('/upload', async (req, res) => {
    const inputURL = req.body.url;
    try {
        const urlResult = urlSchema.safeParse(inputURL);
        if (urlResult.success === false) {
            res.status(403).json({
                msg: "Invalid input"
            })
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({ status: 403, msg: 'Oops!!, invalid input' }));
            }
        } else {

            // get the necessary data required to clone the project
            const url = urlResult.data;
            const splitURL = url.split('/')
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
            
            fs.mkdirSync(`../output/${uploadUUID}`, { recursive: true });
            await git.clone(url, `../output/${uploadUUID}`);
            await uploadToS3(`../output/${uploadUUID}`, uploadUUID);
            await pushToQueue(uploadUUID);
            fs.rmdirSync(`../output/${uploadUUID}`, { recursive: true })
            res.status(200).json({ 
                "id": uploadUUID
            });
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({ status: 200, msg: 'Fetched the project successfully' }));
            }
        }
    } catch (err) {
        console.error(err)
        res.status(500).json({
            msg: "Oops, there is an error from our side"
        })
    }
})

export { uploadRouter }
