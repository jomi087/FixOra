import { SigninInputDTO, SignInOutputDTO } from "../../../dto/auth/SigninDTO";

export interface ISigninUseCase {
    execute(credentials : SigninInputDTO ) : Promise<SignInOutputDTO>
}

