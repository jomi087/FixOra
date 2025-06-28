// From node_modules
import express, { Express } from 'express'
import path from 'path'
import { fileURLToPath } from 'url'; 
import morgan from 'morgan'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv';
dotenv.config();

//From Local files
import mongoConnect from '../infrastructure/database/connection.js';
import authRouter from '../interfaces/routes/authRoute.js';
import userRouter from '../interfaces/routes/userRoute.js'
import adminRouter from '../interfaces/routes/adminRoute.js'

import { errorHandler } from '../interfaces/middleware/errorHandler.js'; 

const app: Express = express()
const port = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url) // why this way cz esmodule dosent directly support __dirname 
const __dirname = path.dirname(__filename)

const corsOptions = {
    origin: process.env.FRONTEND_URL||'http://localhost:5001', // front end url  //this is how we  give access to those url which can access our apis // here its only access for my frontend url how ever  if to make acess forevery one we  user  "*" 
    credentials: true,  //allowing credentials like cookies , headers etc .... 
}

// const corsOptions = { //need to change this with abouve // will change later
//     origin: process.env.FRONTEND_URL || 'http://localhost:5001',
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
// }

// Connect to MongoDB
mongoConnect()

//Middleware
app.use(cookieParser())
app.use(morgan('tiny'))
app.use(cors(corsOptions))
app.use(express.json({ limit: "1mb" }))//Your server will only accept JSON request bodies up to 1 mB in size
app.use(express.urlencoded({ extended: true, limit: "1mb" }))
app.use(express.static(path.join(__dirname, '../public')));  

app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)
app.use('/api/admin', adminRouter)


app.use(errorHandler)

app.listen(port, () => {
    console.log(`Server is started running in http://localhost:${port} `)
})
    

