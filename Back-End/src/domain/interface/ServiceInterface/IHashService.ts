export interface IHashService{
    hash(password: string): Promise<string>
    compare(plainPass: string, hashedPass: string) : Promise<boolean>
}