import { z } from "zod";
import { emailField, firstNameField, lastNameField, mobileField, passwordField } from "./fields.js";

export const signupSchema = z.object({
    fname: firstNameField,
    lname: lastNameField,
    email: emailField ,
    mobileNo: mobileField,
    password: passwordField,
});
