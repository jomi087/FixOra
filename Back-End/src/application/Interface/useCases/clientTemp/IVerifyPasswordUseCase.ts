export interface IVerifyPasswordUseCase{
    execute(password: string, userId : string): Promise<void>
}