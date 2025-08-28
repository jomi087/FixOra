import { IOtpGenratorService } from "../../domain/interface/ServiceInterface/IOtpGeneratorService";

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



/*
below is a  Normal way of 6 digit above is dynamic  length approch with default 6 
also becouse the abouve function is dynmic like  has build on the base of length and also if i want i can add an experiy in this also , if it was jst a static function( like the below once ) then it would be comming in utils   

generate(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

*/
