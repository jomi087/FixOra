import { SignupDTO } from "../../../DTO's/AuthDTO/SignupDTO";

export interface ISignupUseCase {
    execute(userData: SignupDTO): Promise<string>
}