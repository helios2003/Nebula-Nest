import express from 'express';
import fs from 'fs';
import cors from 'cors';

const app = express();
app.use(cors())

app.get('/:id', (req, res) => {
    try {
        const id = req.params.id;
        const status = req.query.status;
        if (status === 'done') {
            fs.unlinkSync(`../logs/${id}.log`);
            res.status(200).json({ message: 'Website is ready to view', status: 'done' });
        } else {
            res.status(200).json({ message: 'Website is being built', status: 'building' });
        }
    } catch(err) {
        res.status(500).json({ message: 'Error occurred', status: 'error' });
    }
});


app.get('/logs/:id', async (req, res) => {
    const id = req.params.id;
    const logs = fs.readFileSync(`../logs/${id}.log`, 'utf-8');
    console.log(logs);
    res.status(200).json({ logs });
})

app.listen(4000, () => {
    console.log('Health check server is running on port 4000');
});
