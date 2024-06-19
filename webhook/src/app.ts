import express from 'express';
import { S3 } from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });
const app = express();
const PORT = 4000;

const s3Client = new S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
    endpoint: process.env.AWS_URL ?? "",
});

app.use(async (req, res) => {
    const hostname = req.hostname;
    const subDomain = hostname.split('.')[0];
    let s3Key = `build/${subDomain}${req.path === '/' ? '/index.html' : req.path}`;
    if (s3Key.endsWith('/')) {
        s3Key += 'index.html';
    }

    try {
        const data = await s3Client.getObject({
            Bucket: 'nebula-nest',
            Key: s3Key.startsWith('/') ? s3Key.slice(1) : s3Key
        }).promise();

        res.setHeader('Content-Type', data.ContentType || 'application/octet-stream');
        res.send(data.Body);
    } catch (error: any) {
        console.error(`Error fetching ${s3Key}:`, error);
        if (error.code === 'NoSuchKey') {
            s3Key = `build/${subDomain}/index.html`;
            console.log(`Fetching fallback: ${s3Key}`);
            try {
                const data = await s3Client.getObject({
                    Bucket: 'nebula-nest',
                    Key: s3Key.startsWith('/') ? s3Key.slice(1) : s3Key
                }).promise();

                res.setHeader('Content-Type', data.ContentType || 'application/octet-stream');
                res.send(data.Body);
            } catch (fallbackError) {
                console.error(`Error fetching fallback ${s3Key}:`, fallbackError);
                res.status(404).send('File not found');
            }
        } else {
            res.status(500).send('Internal Server Error');
        }
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
