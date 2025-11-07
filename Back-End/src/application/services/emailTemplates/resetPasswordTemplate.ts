import { BRAND } from "../../../shared/const/constants";
import { sharedEmailStyles } from "./sharedEmailStyles";

interface ForgotPasswordEmailProps {
    resetUrl: string;
}

export function buildResetPasswordEmail({ resetUrl }: ForgotPasswordEmailProps): string {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Reset Your Password - ${BRAND.NAME}</title>
      <style>${sharedEmailStyles}</style>
    </head>
    <body>
      <div class="container">
        <h2 class="title">Password Reset Request</h2>
        <div class="content">
          <p>You have requested to reset your password for your ${BRAND.NAME} account.</p>
          <p>If you did not request this, please ignore this email — no action will be taken.</p>
          <p>To reset your password, click the button below:</p>
          <p style="text-align:center;">
            <a href="${resetUrl}" class="btn">Reset Password</a>
          </p>
          <p><strong>Note:</strong> This link is valid only for a limited time.</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} ${BRAND.NAME}. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
