import express from 'express';
import fs from 'fs';
import cors from 'cors';

const app = express();
app.use(cors())

app.get('/:id', (req, res) => {
    try {
        const id = req.params.id;
        const status = req.body.status;
        if (status === 'done') {
            fs.unlinkSync(`../logs/${id}.log`);
            res.status(200).json({ message: 'Website is ready to view' });
        } else if (!status) {
            res.status(102).json({ message: 'Website is being built' });
        }
    } catch(err) {
        res.status(500).json({ message: 'Status undefined' });
    }
})

app.get('/logs/:id', async (req, res) => {
    const id = req.params.id;
    const logs = fs.readFileSync(`../logs/${id}.log`, 'utf-8');
    console.log(logs);
    res.status(200).json({ logs });
})

app.listen(4000, () => {
    console.log('Health check server is running on port 4000');
});
