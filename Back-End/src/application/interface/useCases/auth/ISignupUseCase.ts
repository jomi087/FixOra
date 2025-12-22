import { SignupDTO } from "../../../dtos/auth/SignupDTO";

export interface ISignupUseCase {
    execute(userData: SignupDTO): Promise<string>
}