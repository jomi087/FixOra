import { SigninInputDTO, SignInOutputDTO } from "../../../DTO's/AuthDTO/SigninDTO.js";

export interface ISigninUseCase {
    execute(credentials : SigninInputDTO ) : Promise<SignInOutputDTO>
}

