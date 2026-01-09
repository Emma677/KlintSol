import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import mongoose from "mongoose"
import authRoute from "./routes/auth.routes"


dotenv.config()

const app = express()


app.use(cors()) 
app.use(express.json())

const PORT = process.env.PORT || 4000;
const MONGO_URL = process.env.MONGO_URL as string;

// Connect to MongoDB before starting server
mongoose.connect(MONGO_URL)
.then(() => {
    console.log('MongoDB connected successfully')
    app.listen(PORT, () => {
        console.log(`Server is running on port: ${PORT}`)
    })
})
.catch((err) => {
    console.log("MongoDB connection error:", err)
    process.exit(1) 
})

// Routes
app.use('/api', authRoute)

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack)
    res.status(500).json({ error: 'Something went wrong!' })
})