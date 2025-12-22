import { SignOutInputDTO } from "../../../dtos/auth/SingOutDTO";

export interface ISignoutUseCase{
    execute(input:SignOutInputDTO):Promise<void>
}