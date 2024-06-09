import { S3 } from 'aws-sdk';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

const s3Client = new S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
    endpoint: process.env.AWS_URL ?? "",
});

export async function listObjects(dirname: string): Promise<S3.ListObjectsV2Output> {
    const listFiles = await s3Client.listObjectsV2({
        Bucket: 'nebula-nest',
        Prefix: dirname
    }).promise();
    return listFiles;
}

async function downloadFile(s3Object: S3.Object, localDir: string, removePrefix: string) {
    if (!s3Object.Key) return;
    console.log(s3Object);
    const relativePath = s3Object.Key.replace(removePrefix, '');
    const filePath = path.join(localDir, relativePath);
    const fileDir = path.dirname(filePath);

    // if directory not present
    fs.mkdirSync(fileDir, { recursive: true });

    const fileStream = fs.createWriteStream(filePath);
    const s3Stream = s3Client.getObject({
        Bucket: 'nebula-nest',
        Key: s3Object.Key
    }).createReadStream();

    await new Promise((resolve, reject) => {
        s3Stream.pipe(fileStream)
            .on('error', reject)
            .on('close', resolve);
    });
}

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

export async function downloadFiles(listFiles: S3.ListObjectsV2Output, localDir: string, prefixRemove: string) {
    if (!listFiles.Contents) return;

    for (const s3Object of listFiles.Contents) {
        await downloadFile(s3Object, localDir, prefixRemove);
    }
}

export async function uploadFiles(dirname: string, id: string) {
    try {
        const filePaths = getFilePaths(dirname);
        const uploadPromises = filePaths.map(async filePath => {
            const relativePath = path.relative(dirname, filePath).replace(/\\/g, '/');
            await uploadFile(filePath, `build/${id}/${relativePath}`);
        });
        await Promise.all(uploadPromises);
    } catch (error) {
        console.error(error);
        throw new Error('Error uploading files to S3');
    }
}