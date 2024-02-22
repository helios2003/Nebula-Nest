import { Router } from 'express'
import { simpleGit, SimpleGit, CleanOptions } from 'simple-git'
import { v4 as uuidv4 } from "uuid"
import { getFilePaths, uploadToS3 } from '../functions/aws'
import { z } from 'zod'
import { exec } from 'child_process'

const uploadRouter = Router()
const urlSchema = z.string().url()
const checkSize = './clone.sh'

uploadRouter.post('/upload', async (req, res) => {
    const inputURL = req.body.url
    try {
        const urlResult = urlSchema.safeParse(inputURL)
        if (urlResult.success === false) {
            res.status(403).json({
                msg: "Invalid input"
            })
        } else {
            const url = urlResult.data
            const git: SimpleGit = simpleGit()
            let uploadUUID: string = uuidv4().substring(0, 8)
            console.log(uploadUUID)
           
            // repository size too large
            exec('./clone.sh', (error, stdout, stderr) => {
                if (stdout) {
                    if (parseInt(stdout) > 1024 * 1024 * 1024) {
                        res.status(404).json({
                            msg: "Repository size too large"
                        })
                        return
                    } else {
                        git.clone(url, `../output/${uploadUUID}`)
                        const filePaths = getFilePaths(`../output/${uploadUUID}`)
                        //console.log(filePaths)
                        uploadToS3(filePaths)
                        res.status(200).json({
                            'id': uploadUUID,
                        })
                    }
                }
                else {
                    res.status(500).json({
                        msg: "Some error from our side, please check back later"
                    })
                    return
                }
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
