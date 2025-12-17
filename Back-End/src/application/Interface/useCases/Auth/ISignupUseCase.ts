import { SignupDTO } from "../../../dtos/AuthDTO/SignupDTO";

export interface ISignupUseCase {
    execute(userData: SignupDTO): Promise<string>
}