import { SignOutInputDTO } from "../../../DTOs/AuthDTO/SingOutDTO";

export interface ISignoutUseCase{
    execute(input:SignOutInputDTO):Promise<void>
}