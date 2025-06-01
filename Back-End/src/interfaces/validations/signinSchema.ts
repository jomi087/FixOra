import { z } from "zod";

export const signinSchema = z.object({
  email: z.string().trim().email("Invalid email format"),
  password: z.string().trim().min(10, "Password is required"),
});
