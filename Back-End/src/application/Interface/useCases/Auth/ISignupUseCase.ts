import { SignupDTO } from "../../../DTO's/AuthDTO/SignupDTO.js";

export interface ISignupUseCase {
    execute(userData: SignupDTO): Promise<string>
}