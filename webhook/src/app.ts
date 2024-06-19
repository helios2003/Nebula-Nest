import express from 'express';
import httpProxy from 'http-proxy';
const app = express();
import { S3 } from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });
const PORT = 4000;

const s3Client = new S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
    endpoint: process.env.AWS_URL ?? "",
});

const proxy = httpProxy.createProxyServer();

app.use(async (req, res) => {
    const hostname = req.hostname;
    const subDomain = hostname.split('.')[0];
    const s3Key = `build/${subDomain}${req.path === '/' ? '/index.html' : req.path}`;
    console.log(`Fetching: ${s3Key}`);
    try {
        const data = await s3Client.getObject({
            Bucket: 'nebula-nest',
            Key: s3Key.startsWith('/') ? s3Key.slice(1) : s3Key
        }).promise();

        res.setHeader('Content-Type', data.ContentType || 'application/octet-stream');
        res.send(data.Body);
    } catch (error) {
        console.error(`Error fetching ${s3Key}:`, error);
        res.status(404).send('File not found');
    }
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})