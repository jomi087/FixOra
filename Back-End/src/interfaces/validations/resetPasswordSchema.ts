import { z } from "zod"
import { passwordField } from "./fields.js"

export const resetPasswordSchema = z.object({
    token: z.string(),
    password: passwordField,
    cPassword : passwordField
})
    .refine((data) =>  data.password === data.cPassword,{
        message: "Password do not maatch",
        path : ["cPassword"]
    }
)