import 'express-session'
import type { IUser } from '../interfaces/user/user.ts'

export type SessionUser = Omit<IUser, 'password' | '_id'> & {
    id?: string
}
declare module 'express-session' {
    interface SessionData {
        user: SessionUser
    }
}