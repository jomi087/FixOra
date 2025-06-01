// From node_modules
import express from 'express'
import morgan from 'morgan'
import dotenv from 'dotenv';
dotenv.config();

//From Local files
import mongoConnect from '../database/connection.js';
import authRouter from '../../interfaces/routes/authRoute.js'

const app = express()
const port = process.env.PORT || 5000;

mongoConnect()
app.use(morgan('tiny'))
app.use(express.json())


app.use('/', authRouter )


app.listen(port, () => {
    console.log(`Server is started running in http://localhost:${port} `)
})
    

