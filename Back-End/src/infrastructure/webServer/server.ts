// From node_modules
import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv';
dotenv.config();

//From Local files
import mongoConnect from '../database/connection.js';
import authRouter from '../../interfaces/routes/authRoute.js'
import { errorHandler } from '../../interfaces/middleware/errorHandler.js';

const app = express()
const port = process.env.PORT || 5000 ;

const corsOptions = {
    origin: 'http://localhost:5001', // front end url  //this is how we  give access to those url which can access our apis // here its only access for my frontend url how ever  if to make acess forevery one we  user  "*" 
    credentials: true,  //allowing credentials like cookies , headers etc .... 
}

mongoConnect()
app.use(cookieParser())
app.use(morgan('tiny'))
app.use(cors(corsOptions))
app.use(express.json())

app.use('/api/auth', authRouter)


app.use(errorHandler)


app.listen(port, () => {
    console.log(`Server is started running in http://localhost:${port} `)
})
    

