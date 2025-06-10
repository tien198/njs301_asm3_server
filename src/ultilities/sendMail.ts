import dotenv from 'dotenv'
dotenv.config()
import nodemailer from 'nodemailer'



export const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GOOGLE_APP_EMAIL,
        pass: process.env.GOOGLE_APP_PASSWORD
    },
})

export async function sendHtmlMail(to: string, subject: string, html: string) {
    try {
        transporter.sendMail({
            from: process.env.ORGANIZATION_NAME,
            to, subject, html
        })
    } catch (error) {
        console.error(error)
    }
}

export async function sendTextMail(to: string, subject: string, text: string) {
    try {
        transporter.sendMail({
            from: process.env.ORGANIZATION_NAME,
            to, subject, text
        })
    } catch (error) {
        console.error(error)
    }
} 