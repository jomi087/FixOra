export interface verifyArrivalOtpInputDto {
    otp: string;
    token: string;
}

export interface IVerifyArrivalOtpUseCase {
    execute(otp:verifyArrivalOtpInputDto):Promise<any>
}