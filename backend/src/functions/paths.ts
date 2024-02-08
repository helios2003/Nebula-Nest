import fs from "fs"
import path from "path"
import AWS from 'aws-sdk'
import dotenv from 'dotenv'

dotenv.config(require('../../.env'))

AWS.config.update({
    region: '<your-region>',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const s3 = new AWS.S3()

const params = {
    Bucket: 'nebula-nest',
    Key: 'myFile.txt',
    Body: fs.createReadStream('path/to/myFile.txt')
};

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
                filePaths.push(filePath);
            }
        }
    }

    walk(dirPath);
    return filePaths;
}

export async function uploadToS3(filePaths: string[]) {
    for (const filePath of filePaths) {
        const params = {
            Bucket: 'nebula-nest',
            Key: path.basename(filePath),
            Body: fs.createReadStream(filePath)
        };

        try {
            const uploadResponse = await s3.upload(params).promise();
            console.log(`Successfully uploaded ${filePath} to ${uploadResponse.Location}`);
        } catch (error) {
            console.error(`Error uploading ${filePath}: `, error);
        }
    }
}