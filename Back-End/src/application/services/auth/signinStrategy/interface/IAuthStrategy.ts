import { RoleEnum } from "../../../../../shared/constant/Roles.js";
import { SigninDTO } from "../../../../InputDTO's/SigninDTO.js";

export type AuthData = {
  userData : any; 
  role: RoleEnum;
};

export interface IAuthStrategy {
  authenticate(credentials: SigninDTO): Promise<AuthData>;
}

