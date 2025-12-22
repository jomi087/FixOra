import { SigninInputDTO, SignInOutputDTO } from "../../../dtos/auth/SigninDTO";

export interface ISigninUseCase {
    execute(credentials : SigninInputDTO ) : Promise<SignInOutputDTO>
}

