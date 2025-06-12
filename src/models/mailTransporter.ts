import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    auth: {
        user: process.env.GOOGLE_APP_EMAIL,
        pass: process.env.GOOGLE_APP_PASSWORD
    },
    // service: 'gmail',
    host: "smtp.gmail.com",
    port: 465,
    secure: true
})

async function sendHtmlMail(to: string, subject: string, html: string) {
    try {
        transporter.sendMail({
            from: process.env.ORGANIZATION_NAME,
            to, subject, html
        })
    } catch (error) {
        console.error(error)
    }
}

async function sendTextMail(to: string, subject: string, text: string) {
    try {
        transporter.sendMail({
            from: process.env.ORGANIZATION_NAME,
            to, subject, text
        })
    } catch (error) {
        console.error(error)
    }
}

const MailTransporter = { sendHtmlMail, sendTextMail }

export default MailTransporter