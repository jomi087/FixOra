import { SignOutInputDTO } from "../../../dto/auth/SingOutDTO";

export interface ISignoutUseCase{
    execute(input:SignOutInputDTO):Promise<void>
}