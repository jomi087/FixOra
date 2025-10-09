import { RoleEnum } from "../../../../shared/enums/Roles";
import { SignInOutputDTO } from "../../../DTO's/AuthDTO/SigninDTO";

export interface IGoogleSigninUseCase {
    execute(code : string , role : RoleEnum) : Promise<SignInOutputDTO>
}

