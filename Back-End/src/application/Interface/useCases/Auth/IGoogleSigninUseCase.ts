import { RoleEnum } from "../../../../shared/Enums/Roles.js";
import { SignInOutputDTO } from "../../../DTO's/AuthDTO/SigninDTO.js";

export interface IGoogleSigninUseCase {
    execute(code : string , role : RoleEnum) : Promise<SignInOutputDTO>
}

