import type ErrorRes from './models/errorRes';
import type { Request, Response, NextFunction } from 'express';

import express from 'express'
import helmet from 'helmet'
import dotenv from 'dotenv'
dotenv.config()
import authenRouter from './routers/authen';
import sessionMw from './middlewares/sessionMw';
import shopRouter from './routers/shop';



const app = express()

// library middlewares
app.use(helmet())

// custom middlewares
app.use(sessionMw())

// routers
app.use('/api/auth', authenRouter);
app.use('/api/shop', shopRouter);



// error handler
app.use((error: ErrorRes, req: Request, res: Response, next: NextFunction) => {
    console.log(error)
    res.status(error.status || 500).json({
        message: error.message,
        cause: error.cause
    })
})


import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { envValidate } from './ultilities/envValidate';
import User from './models/user';


envValidate();

(async function () {
    await mongoose.connect(process.env.MONGO_URI!)

    app.listen(5000, () => console.log('Server is running on port 5000'))

    const user = await User.findOne({ email: 'admin@gmail.com' })
    if (!user) {
        await User.create({
            email: 'admin@gmail.com',
            password: bcrypt.hashSync('123456', Number(process.env.SALT_LENGTH) || 10),
            name: 'Admin'
        })
    }
})()



/*
    mongoimport --uri="mongodb://127.0.0.1:27017/asm3?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.3.9" --collection="products" --file product.json  --jsonArray
*/