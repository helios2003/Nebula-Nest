import fs from 'fs';
import path from 'path';
import { S3 } from 'aws-sdk';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const s3Client = new S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
    endpoint: process.env.AWS_URL ?? "",
});

export function getFilePaths(dirPath: string): string[] {
    let filePaths: string[] = []

    function walk(dir: string) {
        const files = fs.readdirSync(dir)
        for (let i = 0; i < files.length; i++) {
            const filePath = path.join(dir, files[i])
            const stat = fs.statSync(filePath)
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

export async function uploadFile(inputFilePath: string, outputFilePath: string) {
    const fileContent = fs.readFileSync(inputFilePath);
    await s3Client.upload({
        Body: fileContent,
        Bucket: "nebula-nest",
        Key: outputFilePath
    }).promise();
}

export async function uploadToS3(filePaths: string[]) {
    try {
        for (const filePath of filePaths) {
            const outputFilePath = path.relative('output', filePath);
            console.log(outputFilePath)
            await uploadFile(outputFilePath, filePath);
        }
    } catch (error) {
        console.error(error);
        throw new Error('Error uploading files to S3');
    }
}
