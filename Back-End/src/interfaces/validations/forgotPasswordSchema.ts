import { z } from "zod";
import { emailField } from "./fields.js";

export const forgotPasswordSchema = z.object({
    email:emailField
});
