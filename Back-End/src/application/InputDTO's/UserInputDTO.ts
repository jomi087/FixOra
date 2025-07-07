import { RoleEnum } from "../../shared/constant/Roles.js";
import { SignupDTO } from "./SignupDTO.js";


export type UserInputDTO = SignupDTO & {
  userId: string;
}


