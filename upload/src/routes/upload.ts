import { Router } from 'express'
import { simpleGit, SimpleGit } from 'simple-git'
import { v4 as uuidv4 } from "uuid"
import { getFilePaths, uploadToS3 } from '../functions/aws'
import { z } from 'zod'
import { exec } from 'child_process';
import path from 'path'
import fs from 'fs'

const uploadRouter = Router()
const urlSchema = z.string().url()

uploadRouter.post('/upload', async (req, res) => {
    const inputURL = req.body.url
    try {
        const urlResult = urlSchema.safeParse(inputURL)
        if (urlResult.success === false) {
            res.status(403).json({
                msg: "Invalid input"
            })
        } else {

            // get the necessary data required to clone the project
            const url = urlResult.data;
            // const splitURL = url.split('/')
            // const len = splitURL.length
            // const username = splitURL[len - 2]
            // const projectName = splitURL[len - 1].replace('.git', '')

            const git: SimpleGit = simpleGit()
            let uploadUUID: string = uuidv4().substring(0, 8)
            
           
            //const batchFilePath = path.join(__dirname, 'clone.bat').replace(/\\/g, '/')
            
            // this command checks if the repository size is too large to be cloned or not
            // exec(`cmd /c ${batchFilePath} ${username} ${projectName}`, (error, stdout, stderr) => {
            //     if (error) {
            //         console.error('Error executing batch file:', error)
            //         res.status(500).json({
            //             msg: "Some error from our side, please check back later"
            //         })
            //         return
            //     }
            //     if (stderr) {
            //         console.error('Batch file stderr:', stderr)
            //         res.status(500).json({
            //             msg: "Some error from our side, please check back later"
            //         })
            //         return
            //     }
            //     console.log("Stdout ka output is", stdout)
            //     const size = parseInt(stdout.trim())
            //     console.log(size)
            //     if (isNaN(size)) {
            //         console.error('Invalid size from batch file:', stdout)
            //         res.status(500).json({
            //             msg: "Some error from our side, please check back later"
            //         })
            //         return
            //     }
            //     if (size > 1024) {
            //         res.status(404).json({
            //             msg: "Repository size too large"
            //         })
            //         return
            //     } else {
                    // create the folder for the cloned repository
            fs.mkdirSync(`../output/${uploadUUID}`, { recursive: true })
            await git.clone(url, `../output/${uploadUUID}`)
            const filePaths = getFilePaths(`../output/${uploadUUID}`)
            const urls = await uploadToS3(filePaths)
            res.status(200).json({ 
                "id": uploadUUID
            })
        }
    } catch (err) {
        console.error(err)
        res.status(500).json({
            msg: "Oops, there is an error from our side"
        })
    }
})

export { uploadRouter }
