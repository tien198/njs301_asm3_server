import dotenv from 'dotenv'
dotenv.config()

import session from "express-session";
import MongoStore from "connect-mongodb-session";

const MongoDBStore = MongoStore(session)

const store = new MongoDBStore({
    uri: process.env.MONGO_URI!,
    collection: 'sessions'
})

// Catch errors
store.on('error', function (error) {
    console.log(error);
});


export default function sessionMw() {

    return session({
        secret: process.env.SESSION_SECRET!,
        resave: true,
        saveUninitialized: false,
        store: store,
        cookie: {
            sameSite: 'none'
        }
    })
}