import { RoleEnum } from "../../domain/constant/Roles.js";
import { SignupDTO } from "./SignupDTO.js";


export type UserDTO = SignupDTO & {
  userId: string;
}


