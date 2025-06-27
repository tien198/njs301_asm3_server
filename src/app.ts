import type ErrorRes from './models/errorRes';
import type { Request, Response, NextFunction } from 'express';

import path from 'path'
import express, { Router } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
dotenv.config()
import authenRouter from './routers/authen';
import sessionMw from './middlewares/sessionMw';
import shopRouter from './routers/shop';
import adminRouter from './routers/admin';



const app = express()
app.use(express.static('public'));
app.use(express.static('client'));
app.use('/admin', express.static('admin'));


// Set routing for clientApp and adminApp 
app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'index.html'));

});
app.get(/^\/admin\/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'admin', 'index.html'));
});


const whiteList = [process.env.CLIENT_APP_URL, process.env.ADMIN_APP_URL, process.env.SAME_ORIGIN]
// library middlewares
app.use(
    cors({
        origin(requestOrigin, callback) {
            if (whiteList.indexOf(requestOrigin) !== -1 || !requestOrigin)
                callback(null, true)
            else
                callback(new Error('Not allowed by CORS'))
        },
        credentials: true,
    }),
    helmet(),

)

// custom middlewares
app.use(sessionMw())



// routers
app.use('/api/auth', authenRouter);
app.use((req, res, next) => { setTimeout(() => next(), 700) })
app.use('/api/admin', adminRouter);
app.use('/api/shop', shopRouter);



// error handler
app.use((error: ErrorRes, req: Request, res: Response, next: NextFunction) => {
    console.log(error)
    res.status(error.status || 500).json({
        statusText: error.statusText || 'Internal Server Error',
        data: error.data
    } as ErrorRes)
})


import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { envValidate } from './ultilities/envValidate';
import User from './models/user';


envValidate();

(async function () {
    await mongoose.connect(process.env.MONGO_URI!)

    app.listen(process.env.SERVER_PORT, () => console.log('Server is running on port 5000'))

    const user = await User.findOne({ email: 'admin@gmail.com' })
    if (!user) {
        await User.create({
            email: 'admin@gmail.com',
            password: bcrypt.hashSync('123456', Number(process.env.SALT_LENGTH) || 10),
            name: 'Admin',
            role: 'admin'
        })
        await User.create({
            email: 'consultant@gmail.com',
            password: bcrypt.hashSync('123456', Number(process.env.SALT_LENGTH) || 10),
            name: 'Consultant',
            role: 'consultant'
        })
    }
})()



/*
    mongoimport --uri="mongodb://127.0.0.1:27017/asm3?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.3.9" --collection="products" --file products.json  --jsonArray
    mongoimport --uri="mongodb://127.0.0.1:27017/asm3?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.3.9" --collection="categories" --file categories.json  --jsonArray
*/
