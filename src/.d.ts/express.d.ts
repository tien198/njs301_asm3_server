import 'express'
import type { IUser } from '../interfaces/user/user.ts'

declare module 'express' {
    interface Request {
        user?: IUser
    }
}