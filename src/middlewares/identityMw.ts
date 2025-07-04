import type { Request, Response, NextFunction } from 'express';
import ErrorRes from '../models/errorRes.js';


export function isAuthMw(req: Request, res: Response, next: NextFunction) {
    if (!req.session.user) {
        next(new ErrorRes('Unauthorized', 401))
    }
    next();
}

export function isAdmin(req: Request, res: Response, next: NextFunction) {
    if (!req.session.user || req.session.user.role !== 'admin') {
        next(new ErrorRes('Unauthorized', 401))
    }
    next();
}