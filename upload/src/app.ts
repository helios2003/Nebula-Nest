import express from "express";
import { uploadRouter } from "./routes/upload";
import { createQueue } from "./functions/queue";

const app = express()
app.use(express.json())

async function initializeServer() {
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
    initializeServer();
})