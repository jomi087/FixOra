import { BRAND } from "../../../shared/const/constants";
import { sharedEmailStyles } from "./sharedEmailStyles";


interface ArrivalOtpEmailProps {
    otp: string;
}

export function buildArrivalOtpEmail({ otp }: ArrivalOtpEmailProps): string {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${BRAND.NAME} Arrival OTP</title>
      <style>${sharedEmailStyles}</style>
    </head>
    <body>
      <div class="container">
        <h2 style="text-align:center;color:#222;">${BRAND.NAME} Arrival OTP</h2>
        <p>
          Your service provider has indicated that they have arrived at your location. 
          Please provide the OTP below to the provider <strong>only after you have verified their arrival</strong>.
        </p>
        <p style="text-align:center; font-size:18px; margin:20px 0;">
          <strong>Your OTP code is:</strong><br />
          <span style="display:inline-block; background:#007bff; color:#fff; padding:10px 20px; border-radius:6px; font-weight:bold; letter-spacing:2px; font-size:20px;">
            ${otp}
          </span>
        </p>
        <p>
          For your security, <strong>do not share this OTP</strong> with anyone else or before the provider reaches your home.
        </p>
        <div class="footer">
          <p>Thank you for trusting ${BRAND.NAME}.</p>
          <p>© ${new Date().getFullYear()} ${BRAND.NAME}. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
