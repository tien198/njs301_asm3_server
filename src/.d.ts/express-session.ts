import 'express-session'
import type IUser from '../interfaces/user/user.ts'

declare module 'express-session' {
    interface SessionData {
        user: IUser
    }
}