import { z } from "zod"
import { passwordField } from "./fields.js"
import { Messages } from "../../shared/Messages.js"

export const resetPasswordSchema = z.object({
    token: z.string(),
    password: passwordField,
    cPassword : passwordField
})
    .refine((data) =>  data.password === data.cPassword,{
        message: Messages.PASSWORDS_DO_NOT_MATCH,
        path : ["cPassword"]
    }
)