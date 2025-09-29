import express from 'express'
import helmet from 'helmet'
import cors from 'cors';
import {json, urlencoded} from 'express'
import authRouter from './routes/auth'

const app = express()

//Basic security
app.use(helmet())

//Parsers
app.use(json())
app.use(urlencoded({extended: false}))

//CORS 
const allowed = (Bun.env.CORS_ORIGIN ?? process.env.CORS_ORIGIN ?? 'http://localhost:3000').split(',')
app.use(
    cors({
        origin: (origin, cb) => {
            //Allow request without origin like postman or curl
            if (!origin) return cb(null, true)
            if(allowed.includes(origin)) return cb(null, true)
            return cb(new Error('CORS not allowed'))
        },
        credentials: true,
    })
)

//Routes
app.use('/api/auth', authRouter)

export default app