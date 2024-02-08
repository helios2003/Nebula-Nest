import { Router } from 'express'
import { simpleGit, SimpleGit, CleanOptions } from 'simple-git'
import {v4 as uuidv4} from "uuid"

const uploadRouter = Router()

uploadRouter.post('/upload', async (req, res) => {
    const url = req.body.url
    try {
        const git: SimpleGit = simpleGit()
        let uploadUUID: string = uuidv4().substring(0, 8)
        console.log(uploadUUID)
        await git.clone(url, `./output/${uploadUUID}`)
        res.status(200).json({
            'id': uploadUUID
        })
    } catch(err) {
        console.error(err)
        res.status(500).json({
            msg: "Oops, there is an error from our side"
        })
    }
}) 

export { uploadRouter }
