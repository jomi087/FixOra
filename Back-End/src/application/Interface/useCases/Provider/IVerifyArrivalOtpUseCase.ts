
export interface IVerifyArrivalOtpUseCase {
    execute(otp: string, token: string):Promise<void>
}

