import express from "express"

const app = express()
app.use(express.json())


app.listen(5000, () => {
    console.log("Deployment server running on port 5000")
})
