import { z } from "zod";
import { emailField, passwordField, roleField } from "./fields.js";

export const signinSchema = z.object({
  email: emailField,
  password: passwordField,
  role: roleField
});
