import type { Request, Response, NextFunction } from 'express';
import type IUser from '../interfaces/user/user.ts';

import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
dotenv.config()
import ErrorRes from '../models/errorRes.ts';


export function isAuthMw(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        throw new ErrorRes('Unauthorized', 401)
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as IUser
    req.user = decoded
    next();
}