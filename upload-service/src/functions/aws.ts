import fs from "fs"
import path from "path"
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import dotenv from 'dotenv'

dotenv.config({ path: '../.env' })
console.log(process.env.AWS_ACCESS_KEY_ID)
const s3Client = new S3Client({
    region: "ap-south-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
    },
})

export function getFilePaths(dirPath: string): string[] {
    let filePaths: string[] = []

    function walk(dir: string) {
        const files = fs.readdirSync(dir)
        for (let i = 0; i < files.length; i++) {
            const filePath = path.join(dir, files[i])
            const stat = fs.statSync(filePath)
            if (stat.isDirectory()) {
                walk(filePath)
            } else {
                filePaths.push(path.resolve(filePath))
            }
        }
    }

    walk(dirPath)
    return filePaths
}

export async function uploadToS3(dirPath: string[]) {
    try {
        const urls = []
        for (const filePath of dirPath) {
            const fileContent = fs.readFileSync(filePath)
            const uploadParams = {
                Bucket: 'nebula-nest',
                Key: path.basename(filePath),
                Body: fileContent
            }
            const command = new PutObjectCommand(uploadParams)
            const response = await s3Client.send(command)
            console.log(response)
            const url = await getSignedUrl(s3Client, new PutObjectCommand({ ...uploadParams }))
            urls.push(url)
        }
        return urls
    } catch (error) {
        console.error(error)
    }
}
