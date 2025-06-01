import { IOtpGenratorService } from "../../domain/interface/ServiceInterface/IOtpGeneratorService.js";

export class OtpGenratorservice implements IOtpGenratorService{
    
    generateOtp(length: number = 6): string {
    let otp = '';
    const digits = '0123456789';

    for (let i = 0; i < length; i++) {
      otp += digits[Math.floor(Math.random() * 10)];
    }

    return otp;
  }
}



/* Normal way of 6 digit above is dynamic  length approch default 6  
generate(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
*/
