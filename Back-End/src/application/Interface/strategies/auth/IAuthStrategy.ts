import { RoleEnum } from "../../../../shared/Enums/Roles.js";
import { SigninInputDTO } from "../../../DTO's/AuthDTO/SigninDTO.js";



export type AuthData = {
  userData : any; 
  role: RoleEnum;
};

export interface IAuthStrategy {
  authenticate(credentials: SigninInputDTO): Promise<AuthData>;
}


