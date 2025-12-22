import { RoleEnum } from "../../../../shared/enums/Roles";
import { SignInOutputDTO } from "../../../dto/auth/SigninDTO";

export interface IGoogleSigninUseCase {
    execute(code : string , role : RoleEnum) : Promise<SignInOutputDTO>
}

