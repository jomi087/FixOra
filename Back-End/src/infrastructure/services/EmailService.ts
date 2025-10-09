import nodemailer from "nodemailer";
import { IEmailService } from "../../domain/interface/ServiceInterface/IEmailService";

export class EmailService implements IEmailService {
  
    async sendEmail(to: string, subject: string, html: string): Promise<void> {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASSWORD 
            },
        });
        const mailOptions = {
            from: process.env.MAIL_USER,
            to,
            subject,
            html
        };

        try {
            const info = await transporter.sendMail(mailOptions);
            console.log("Mail has been sent:", info.response);
        } catch (error) {
            console.error("Failed to send email:", error.message);
            throw new Error("Failed to send email");
        }
    }
}

