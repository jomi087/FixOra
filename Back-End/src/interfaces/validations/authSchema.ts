import { z } from "zod";
import { Messages } from "../../shared/Messages.js"
import {
    firstNameField,
    lastNameField,
    mobileField,
    emailField,
    roleField,
    passwordField
} from "./fields.js";

export const signupSchema = z.object({
    fname: firstNameField,
    lname: lastNameField,
    email: emailField ,
    mobileNo: mobileField,
    password: passwordField,
});

export const signinSchema = z.object({
  email: emailField,
  password: passwordField,
  role: roleField
});

export const forgotPasswordSchema = z.object({
    email:emailField
});

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

export const verifyPasswordSchema = z.object({
    password:passwordField
});

