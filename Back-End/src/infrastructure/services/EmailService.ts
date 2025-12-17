import nodemailer from "nodemailer";
import { IEmailService } from "../../domain/interface/serviceInterface/IEmailService";
import { AppError } from "../../shared/errors/AppError";
import { HttpStatusCode } from "../../shared/enums/HttpStatusCode";
import { Messages } from "../../shared/const/Messages";

export class EmailService implements IEmailService {

    async sendEmail(to: string, subject: string, html: string): Promise<void> {
        try {
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

            await transporter.sendMail(mailOptions);
        } catch (error: unknown) {
            throw new AppError(HttpStatusCode.INTERNAL_SERVER_ERROR,
                Messages.UNABLE_TO_SEND_EMAIL,
                error instanceof Error ? error.message : String(error)
            );
        }

    }
}

