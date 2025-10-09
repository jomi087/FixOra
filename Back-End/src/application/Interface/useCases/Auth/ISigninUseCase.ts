import { SigninInputDTO, SignInOutputDTO } from "../../../DTOs/AuthDTO/SigninDTO";

export interface ISigninUseCase {
    execute(credentials : SigninInputDTO ) : Promise<SignInOutputDTO>
}

