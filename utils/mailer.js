import dotenv from 'dotenv'
import nodemailer from 'nodemailer'

dotenv.config()

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: Number(process.env.EMAIL_PORT) === 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

export default function mailer(to, subject, html) {
  transporter.sendMail({
    from: `"${process.env.APP_NAME}" ${process.env.EMAIL_USER}`,
    to,
    subject,
    html
  })
}
