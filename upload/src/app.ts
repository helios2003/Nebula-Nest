import express from "express";
import { uploadRouter } from "./routes/upload";
import { createQueue } from "./functions/queue";
// @ts-ignore
import cors from 'cors';

const app = express()
app.use(cors())
app.use(express.json())

async function initializeQueue() {
    try {
        await createQueue();  
        console.log('Queue initialized successfully');
    } catch (error) {
        console.error('Failed to initialize queue:', error);
    }
};

app.use('/', uploadRouter)
app.listen(3000, () => {
    console.log('Server is running on port 3000');
    initializeQueue();
})