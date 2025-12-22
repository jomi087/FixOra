import { SigninInputDTO, SignInOutputDTO } from "../../../dtos/AuthDTO/SigninDTO";

export interface ISigninUseCase {
    execute(credentials : SigninInputDTO ) : Promise<SignInOutputDTO>
}

