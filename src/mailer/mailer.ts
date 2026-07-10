import "dotenv/config"
import nodemailer from "nodemailer"
import SMTPTransport from "nodemailer/lib/smtp-transport"

export const sendMail = async (
  email: string,
  subject: string,
  message: string,
  html: string,
) => {
  const emailUser = process.env.EMAIL_USER?.trim()
  const emailPass = process.env.NODE_MAILER_PASS?.trim()

  if (!emailUser || !emailPass) {
    throw new Error("Email credentials are not configured. Set EMAIL_USER and NODE_MAILER_PASS.")
  }
  
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT || 465) || 465,
      secure: process.env.SMTP_SECURE !== "false" || true,
      service: process.env.SMTP_SERVICE || "gmail",
      auth: {
        user: emailUser || process.env.EMAIL_USER,
        pass: emailPass || process.env.NODE_MAILER_PASS,
      },
    } as SMTPTransport.Options)

    const mailOptions: nodemailer.SendMailOptions = {
      from: emailUser || process.env.EMAIL_USER,
      to: email,
      subject: subject,
      text: message,
      html: html
    }

    const mailRes = await transporter.sendMail(mailOptions)

    if (mailRes.accepted.length > 0) {
      return "Email sent successfully"
    }

    if (mailRes.rejected.length > 0) {
      throw new Error("Email server rejected the recipient address")
    }

    throw new Error("Email server returned an unexpected response")
  } catch (error: unknown) {
    const details = error instanceof Error ? error.message : "Unknown mail error"
    throw new Error(`Failed to send email: ${details}`)
  }
}