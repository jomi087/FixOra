import { z } from "zod";
import { RoleEnum } from "../../domain/constant/Roles.js";
import { emailField, passwordField, roleFiled } from "./fields.js";

export const signinSchema = z.object({
  email: emailField,
  password: passwordField,
  role: roleFiled
});



