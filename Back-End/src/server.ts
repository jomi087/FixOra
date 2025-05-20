// From node_modules
import express from 'express'
import morgan from 'morgan'
import dotenv from 'dotenv';
dotenv.config();

//From Local files
import mongoConnect from './infrastructure/database/mongodb/connection.js';


const app = express()
const port = process.env.PORT || 5000;

mongoConnect()
app.use(morgan('tiny'))
app.use(express.json())


app.listen(port, () => {
    console.log(`Server is started running in http://localhost:${port}`)
})
    

