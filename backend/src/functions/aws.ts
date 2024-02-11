import fs from "fs"
import path from "path"
import AWS from 'aws-sdk'
import dotenv from 'dotenv'

dotenv.config({ path: './../../.env' })

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS,
    endpoint: process.env.AWS_URL
})

export function getFilePaths(dirPath: string): string[] {
    let filePaths: string[] = [];

    function walk(dir: string) {
        const files = fs.readdirSync(dir);
        for (let i = 0; i < files.length; i++) {
            const filePath = path.join(dir, files[i]);
            const stat = fs.statSync(filePath);
            if (stat.isDirectory()) {
                walk(filePath);
            } else {
                filePaths.push(path.resolve(filePath))
            }
        }
    }

    walk(dirPath);
    return filePaths;
}

export async function uploadToS3(dirPath: string[]) {
    try {
        for (const filePath of dirPath) {
            const fileContent = fs.readFileSync(filePath)
            const uploadParams = {
                Bucket: 'nebula-nest',
                Key: filePath,
                Body: fileContent
            }
            const response = await s3.upload(uploadParams).promise()
            console.log(response)
        }
    } catch (error) {
        console.log("hello bro, so many errors")
        console.error(error);
    }
}