export interface ISignoutStrategy {
    signout( userId : string ): Promise<void>
}