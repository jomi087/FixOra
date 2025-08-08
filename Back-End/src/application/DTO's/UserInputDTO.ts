import { RoleEnum } from "../../shared/Enums/Roles.js";
import { SignupDTO } from "./SignupDTO.js";


export type UserInputDTO = SignupDTO & {
  userId: string;
}


