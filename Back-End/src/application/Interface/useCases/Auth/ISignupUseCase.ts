import { SignupDTO } from "../../../DTOs/AuthDTO/SignupDTO";

export interface ISignupUseCase {
    execute(userData: SignupDTO): Promise<string>
}