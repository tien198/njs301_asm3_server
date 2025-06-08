import type ErrorRes from './models/errorRes.ts';
import type { Request, Response, NextFunction } from 'express';

import express from 'express'
import helmet from 'helmet'
import dotenv from 'dotenv'
dotenv.config()
import authenRouter from './routers/authen.ts';



const app = express()

app.use(helmet())

app.use('/api/auth', authenRouter);

app.use((error: ErrorRes, req: Request, res: Response, next: NextFunction) => {
    console.log(error)
    res.status(error.status || 500).json({
        message: error.message,
        cause: error.cause
    })
})


import mongoose from 'mongoose';
import User from './models/user.ts';
import bcrypt from 'bcryptjs';

const mongoUri = process.env.MONGO_URI
if (!mongoUri)
    throw new Error('MONGO_URI is not set')

const saltLength = Number(process.env.SALT_LENGTH) || 10


await mongoose.connect(mongoUri)

app.listen(5000, () => console.log('Server is running on port 5000'))

const user = await User.findOne({ email: 'admin@gmail.com' })
if (!user) {
    await User.create({
        email: 'admin@gmail.com',
        password: bcrypt.hashSync('123456', saltLength),
        name: 'Admin'
    })
}


/*
    mongoimport --uri="mongodb://127.0.0.1:27017/asm3?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.3.9" --collection="products" --file product.json  --jsonArray
*/