import fs from 'fs';
import path from 'path';
import { S3 } from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const s3Client = new S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
    endpoint: process.env.AWS_URL ?? "",
});

function getFilePaths(dirname: string) {
    // Recursively get all file paths from the directory
    let filePaths: string[] = [];
    function readDir(dir: string) {
        const files = fs.readdirSync(dir);
        files.forEach(file => {
            const fullPath = path.join(dir, file);
            if (fs.statSync(fullPath).isDirectory()) {
                readDir(fullPath);
            } else {
                filePaths.push(fullPath);
            }
        });
    }
    readDir(dirname);
    return filePaths;
}

async function uploadFile(inputFilePath: string, outputFilePath: string) {
    console.log(`Uploading file: ${inputFilePath} to S3 path: ${outputFilePath}`);
    const fileContent = fs.readFileSync(inputFilePath);
    await s3Client.upload({
        Body: fileContent,
        Bucket: "nebula-nest",
        Key: outputFilePath
    }).promise();
}

export async function uploadToS3(dirname: string, id: string) {
    try {
        const filePaths = getFilePaths(dirname);
        const uploadPromises = filePaths.map(async filePath => {
            const relativePath = path.relative(dirname, filePath).replace(/\\/g, '/');
            await uploadFile(filePath, `output/${id}/${relativePath}`);  
        });
        await Promise.all(uploadPromises);
    } catch (error) {
        console.error(error);
        throw new Error('Error uploading files to S3');
    }
}
