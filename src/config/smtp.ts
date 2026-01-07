import nodemailer from "nodemailer"
import dotenv from "dotenv"

dotenv.config()

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    }
})

const sendSMTPEmail = async (to: string, subject: string, text: string): Promise<void> => {
    try {
        const mailOptions = {
            from: process.env.SMTP_USER, 
            to,
            subject,
            text
        }
        await transporter.sendMail(mailOptions)
    } catch (error) {
        console.log("error sending email", error)
    }
}

export default sendSMTPEmail