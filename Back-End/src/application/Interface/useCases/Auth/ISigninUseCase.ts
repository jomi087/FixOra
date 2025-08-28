import { SigninInputDTO, SignInOutputDTO } from "../../../DTO's/AuthDTO/SigninDTO";

export interface ISigninUseCase {
    execute(credentials : SigninInputDTO ) : Promise<SignInOutputDTO>
}

