import { RoleEnum } from "../../../../../domain/constant/Roles.js";
import { SigninDTO } from "../../../../dtos/SigninDTO.js";

export type AuthData = {
  userData : any; 
  role: RoleEnum;
};

export interface IAuthStrategy {
  authenticate(credentials: SigninDTO): Promise<AuthData>;
}

