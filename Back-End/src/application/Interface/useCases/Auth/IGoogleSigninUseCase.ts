import { RoleEnum } from "../../../../shared/enums/Roles";
import { SignInOutputDTO } from "../../../DTOs/AuthDTO/SigninDTO";

export interface IGoogleSigninUseCase {
    execute(code : string , role : RoleEnum) : Promise<SignInOutputDTO>
}

