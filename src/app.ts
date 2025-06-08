import express from 'express'
import authenRouter from './routers/authen.ts';
import type ErrorRes from './models/errorRes.ts';
import type { Request, Response, NextFunction } from 'express';

const app = express()

app.use('/api/auth', authenRouter);

app.use((error: ErrorRes, req: Request, res: Response, next: NextFunction) => {
    res.status(error.status || 500).json({
        message: error.message,
        cause: error.cause
    })
})


app.listen(5000, () => console.log('Server is running on port 3000'))

/*
    mongoimport --uri="mongodb://127.0.0.1:27017/asm3?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.3.9" --collection="products" --file product.json  --jsonArray
*/