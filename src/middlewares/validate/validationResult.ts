import type { Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'
import ErrorRes from '../../models/errorRes';
import { createErrorRes } from '../../ultilities/exValidator/createErrorRes';

export function validate(errorMsg: string) {
    return function (req: Request, res: Response, next: NextFunction) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new ErrorRes(errorMsg, 422, createErrorRes(errors));
        }
        next()
    }
}