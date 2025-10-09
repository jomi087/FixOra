import { RoleEnum } from "../../../../shared/enums/Roles";
import { SigninInputDTO } from "../../../DTO's/AuthDTO/SigninDTO";



export type AuthData = {
  userData : any; 
  role: RoleEnum;
};

export interface IAuthStrategy {
  authenticate(credentials: SigninInputDTO): Promise<AuthData>;
}


