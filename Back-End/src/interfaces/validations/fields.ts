import { z } from "zod";
import { RoleEnum } from "../../shared/constant/Roles.js";
import { KYCStatus } from "../../shared/constant/KYCstatus.js";


export const firstNameField = z.string().trim().min(4, "First name is required, minimum 4 Characters");
export const lastNameField = z.string().trim().min(2, "Last name is required, minimum 2 Characters");
export const emailField = z.string().trim().email("Invalid email format");
export const mobileField = z.string().trim().regex(/^[6-9]\d{9}$/, "Invalid mobile number")
export const passwordField = z.string().trim().min(10, "Password must be at least 10 characters");
export const roleField = z.nativeEnum(RoleEnum, { required_error: "Role is required", invalid_type_error: "Invalid role", })
export const kycField =  z.nativeEnum(KYCStatus, { required_error: "kyc is required", invalid_type_error: "Invalid KycStatus", })


export const houseInfoField = z.string()
export const streetField  = z.string()
export const districtField = z.string().min(1, "Address invalid missing District field")
export const cityField = z.string().min(1, "Address invalid missing City field")
export const localityField = z.string().min(1, "Address invalid missing Locality field")
export const stateField = z.string().min(1, "Address invalid missing state field")
export const postalCodeField = z.string().min(4, "Address invalid, Postal code is too short").max(10, "Address indvalid, Postal code is too long")

export const latitudeField =  z.number().min(-90).max(90)
export const longitudeField = z.number().min(-180).max(180)
