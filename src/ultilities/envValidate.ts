import dotenv from 'dotenv'
dotenv.config()

export function envValidate() {
    // MongoDB connection
    if (!process.env.MONGO_URI)
        throw new Error('MONGO_URI is not set')

    //  Client url
    if (!process.env.CLIENT_URL)
        throw new Error('CLIENT_URL is not set')

    // Session
    if (!process.env.SESSION_SECRET)
        throw new Error('SESSION_SECRET is not set')

    // Hash
    if (!process.env.SALT_LENGTH)
        throw new Error('SALT_LENGTH is not set')

    // Send mail vie GG mail server
    if (!process.env.GOOGLE_APP_EMAIL)
        throw new Error('GOOGLE_APP_EMAIL is not set')

    if (!process.env.GOOGLE_APP_PASSWORD)
        throw new Error('GOOGLE_APP_PASSWORD is not set')


}