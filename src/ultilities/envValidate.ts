import dotenv from 'dotenv'
dotenv.config()

export function envValidate() {

    if (!process.env.MONGO_URI)
        throw new Error('MONGO_URI is not set')

    if (!process.env.SALT_LENGTH)
        throw new Error('SALT_LENGTH is not set')

    if (!process.env.SESSION_SECRET)
        throw new Error('SESSION_SECRET is not set')

}