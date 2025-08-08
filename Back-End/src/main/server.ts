// From node_modules
import express, { Express } from 'express'
import http from "http"
import path from 'path'
import { fileURLToPath } from 'url'; 
import morgan from 'morgan'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv';
dotenv.config();

//From Local files
import mongoConnect from '../infrastructure/database/connection.js';
import publicRouter from '../interfaces/routes/publicRouter.js'
import authRouter from '../interfaces/routes/authRoute.js';
import userRouter from '../interfaces/routes/userRoute.js'
import providerRouter from '../interfaces/routes/providerRoute.js'
import adminRouter from '../interfaces/routes/adminRoute.js'

import { errorHandler } from '../interfaces/middleware/errorHandler.js'; 
import { BodyParserLimits } from '../shared/constants.js';
import { initializeSocket } from '../infrastructure/socket/config.js';

const app: Express = express()
const port = process.env.PORT ;

const __filename = fileURLToPath(import.meta.url) // why this way cz esmodule dosent directly support __dirname 
const __dirname = path.dirname(__filename)

const corsOptions = { 
    origin: process.env.FRONTEND_URL ,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
}

// Connect to MongoDB
mongoConnect()

//Middleware
app.use(cookieParser())
app.use(morgan('tiny'))  //logs incoming http request
app.use(cors(corsOptions))
app.use(express.json({ limit: BodyParserLimits.JSON_LIMIT }))//Your server will only accept JSON request bodies up to 1 mB in size
app.use(express.urlencoded({ extended: true, limit: BodyParserLimits.URLENCODED_LIMIT }))
app.use(express.static(path.join(__dirname, '../public')));  

app.use('/api/public',publicRouter)
app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)
app.use('/api/provider',providerRouter)
app.use('/api/admin', adminRouter)

app.use(errorHandler)

const server = http.createServer(app); // this was implimented so that i can get the server instanace (server obj) which is required is socket i.O other-wise we only use the listen method of server
const io = initializeSocket(server)
console.log("Socket.IO initialized");

server.listen(port, () => {
    console.log(`Server is started running in http://localhost:${port}`)
})
