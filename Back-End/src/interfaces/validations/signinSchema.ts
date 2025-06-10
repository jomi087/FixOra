import { z } from "zod";
import { RoleEnum } from "../../domain/constant/Roles.js";

export const signinSchema = z.object({
  email: z.string().trim().email("Invalid email format"),
  password: z.string().trim().min(10, "Password is required"),
  role: z.nativeEnum(RoleEnum, {
    required_error: "Role is required",
    invalid_type_error: "Invalid role selected",
  }),
});



