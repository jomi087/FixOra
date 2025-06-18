import { z } from "zod";
import { RoleEnum } from "../../domain/constant/Roles.js";


export const firstNameField = z.string().trim().min(4, "First name is required, minimum 4 Characters");
export const lastNameField = z.string().trim().min(2, "Last name is required, minimum 2 Characters");
export const emailField = z.string().trim().email("Invalid email format");
export const mobileField = z.string().trim().regex(/^[6-9]\d{9}$/, "Invalid mobile number")
export const passwordField = z.string().trim().min(10, "Password must be at least 10 characters");
export const roleFiled =   z.nativeEnum(RoleEnum, {required_error: "Role is required",invalid_type_error: "Invalid role selected",})