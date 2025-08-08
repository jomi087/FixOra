import { RoleEnum } from "../../../../shared/Enums/Roles.js";
import { SigninDTO } from "../../../DTO's/SigninDTO.js";


export type AuthData = {
  userData : any; 
  role: RoleEnum;
};

export interface IAuthStrategy {
  authenticate(credentials: SigninDTO): Promise<AuthData>;
}

