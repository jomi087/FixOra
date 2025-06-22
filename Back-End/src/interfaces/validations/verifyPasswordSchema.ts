import { z } from "zod";
import { passwordField } from "./fields.js";

export const verifyPasswordSchema = z.object({
    password:passwordField
});
