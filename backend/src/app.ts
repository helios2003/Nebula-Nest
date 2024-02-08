import express from "express"
import { uploadRouter } from "./routes/upload"

const app = express()

app.use(express.json())
app.use('/', uploadRouter)
app.listen(3000, () => {
    console.log('Server is running on port 3000')
})