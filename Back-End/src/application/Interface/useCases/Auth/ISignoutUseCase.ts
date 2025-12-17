import { SignOutInputDTO } from "../../../dtos/AuthDTO/SingOutDTO";

export interface ISignoutUseCase{
    execute(input:SignOutInputDTO):Promise<void>
}