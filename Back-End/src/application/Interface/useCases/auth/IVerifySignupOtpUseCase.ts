export interface IVerifySignupOtpUseCase {
    execute(otpData: string , token : string): Promise<void>
}