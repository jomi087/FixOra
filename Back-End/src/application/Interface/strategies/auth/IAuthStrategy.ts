import { RoleEnum } from "../../../../shared/enumss/Roles";
import { SigninInputDTO } from "../../../dtos/AuthDTO/SigninDTO";



export type AuthData = {
  userData : any; 
  role: RoleEnum;
};

export interface IAuthStrategy {
  authenticate(credentials: SigninInputDTO): Promise<AuthData>;
}


