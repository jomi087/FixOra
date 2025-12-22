import { BRAND } from "../../../shared/const/constants";
import { DisputeType } from "../../../shared/enums/Dispute";

interface DisputeReportEmailProps {
    disputeId: string;
    disputeType: DisputeType;
}

export function buildDisputeReportEmail({ disputeId, disputeType }: DisputeReportEmailProps): string {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Thank You for Your Report</title>
      <style>
        body { font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f6f9fc; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); padding: 30px 25px; }
        .logo { text-align: center; margin-bottom: 20px; }
        .logo img { width: 120px; }
        .title { color: #222; font-size: 22px; font-weight: 600; text-align: center; margin-bottom: 15px; }
        .content { font-size: 15px; line-height: 1.6; margin-bottom: 20px; }
        .content strong { color: #111; }
        .footer { text-align: center; font-size: 13px; color: #888; margin-top: 25px; border-top: 1px solid #eee; padding-top: 15px; }
        .btn { display: inline-block; margin-top: 15px; background-color: #007bff; color: #fff !important; text-decoration: none; padding: 10px 18px; border-radius: 6px; font-weight: 500; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">
          <img src="${BRAND.LOGO_URL}" alt="${BRAND.NAME} Logo" width="140" />
        </div>
        <h2 class="title">Thank You for Reaching Out</h2>
        <div class="content">
          <p>Hi there,</p>
          <p>We’ve received your <strong>${disputeType}</strong> report and our team will review it shortly.</p>
          <p>Thank you for helping us keep the ${BRAND.NAME} community safe and fair.</p>
          <p>Your report has been logged under ID: <strong>${disputeId.split("-")[0]}</strong></p>
          <p>If we need more information, we’ll reach out via this email.</p>
          <a href="${BRAND.FRONTEND_URL}" class="btn">Visit ${BRAND.NAME}</a>
        </div>
        <div class="footer">
          <p>Thank you,<br>The ${BRAND.NAME} Team</p>
          <p>© ${new Date().getFullYear()} ${BRAND.NAME}. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
