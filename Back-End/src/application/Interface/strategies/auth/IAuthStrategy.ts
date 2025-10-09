import { RoleEnum } from "../../../../shared/enums/Roles";
import { SigninInputDTO } from "../../../DTOs/AuthDTO/SigninDTO";



export type AuthData = {
  userData : any; 
  role: RoleEnum;
};

export interface IAuthStrategy {
  authenticate(credentials: SigninInputDTO): Promise<AuthData>;
}


