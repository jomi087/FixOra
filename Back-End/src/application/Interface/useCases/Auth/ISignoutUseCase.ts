export interface ISignoutUseCase{
    execute(userId : string):Promise<void>
}