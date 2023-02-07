// import cors from 'cors';
import express from 'express'
dotenv.config()
const app = express()
import dotenv from 'dotenv'
import 'express-async-errors'
import morgan from 'morgan'
// db and authentication
import connectDB from './db/connect.js'

import { dirname } from 'path'
import { fileURLToPath } from 'url'
import path from 'path'


import helmet from 'helmet';
import xss from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';
import cookieParser from 'cookie-parser'

// routes 
import authRouter from './routes/authRoutes.js'
import jobsRoutes from './routes/jobsRoutes.js'


//middleware
import errorHandlerMiddleware from './middleware/error.handler.js'
import notFoundMiddleware from './middleware/not-found.js'
import authenticateUser from './middleware/auth.js';

if(process.env.NODE_ENV !== 'production'){
    app.use(morgan('dev'))
}
// app.use(cors())
app.use(express.json())

// app.get('/',(req,res)=>{
//     res.json({msg:'Welcome '})
// })
// app.get('/api/v1',(req,res)=>{
//     res.json({msg:'API '})
// })
const _dirname = dirname(fileURLToPath(import.meta.url))
//only when deploy


app.use(express.json());
app.use(cookieParser())
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());
//public///// assest
app.use(express.static(path.resolve(_dirname,'./client/build'))) 

app.use('/api/v1/auth',authRouter)
app.use('/api/v1/jobs',authenticateUser,jobsRoutes)

app.get('*', (req,res)=> {
    res.sendFile(path.resolve(__dirname,'./client/build','index.html'))
})
//if none of them match
//app.use im going to use all https patch get post ,, all
app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 5000

const start = async() => {
    try {
        await connectDB(process.env.MONGO_URL)
        app.listen(port,()=>{
            console.log(`Server is listning ${port}`);
        })
    } catch (error) {
        console.log(error);
    }
}

start()