
import { SignupDTO } from "../../interfaces/validations/signupSchema.js";

export type UserDTO = SignupDTO & {
  userId: string;
}


