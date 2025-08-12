import { z } from "zod";

export const optionalStringField = z.string().optional();

export const firstNameField = z.string().trim().min(3, "First name is required, minimum 4 Characters");
export const lastNameField = z.string().trim().min(2, "Last name is required, minimum 2 Characters");
export const emailField = z.string().trim().email("Invalid email format");
export const mobileField = z.string().trim().regex(/^[1-9]\d{9}$/, "Invalid mobile number") //change 1 to 6 later
export const passwordField = z.string().trim().min(10, "Password must be at least 10 characters");
export const roleField = z.enum(["customer","provider","admin"], { required_error: "Role is required", invalid_type_error: "Invalid role", })
export const kycField =  z.enum(["Pending","Approved","Rejected"], { required_error: "kyc is required", invalid_type_error: "Invalid KycStatus", })

export const houseInfoField = z.string()
export const streetField  = z.string()
export const districtField = z.string().min(1, "Address invalid missing District field")
export const cityField = z.string().min(1, "Address invalid missing City field")
export const localityField = z.string().min(1, "Address invalid missing Locality field")
export const stateField = z.string().min(1, "Address invalid missing state field")
export const postalCodeField = z.string().min(6, "Address invalid, Postal code is too short").max(10, "Address indvalid, Postal code is too long")

export const latitudeField =  z.number().min(-90).max(90)
export const longitudeField = z.number().min(-180).max(180)

export const providerIdField = z.string({ required_error: "Provider info is missing" }).uuid("Invalid provider ID format")
export const providerUserIdField = z.string({ required_error: "Provider info is missing" }).uuid("Invalid provider ID format")
export const fullDateField = z.string({ required_error: "Date is required" }).regex(/^\d{2}-\d{2}-\d{4}$/, "Date must be in DD-MM-YYYY format")
export const timeField = z.string({ required_error: "Time is required" }).regex(/^\d{2}:\d{2}$/, "Time must be in HH:MM format")
export const issueTypeIdField = z.string({ required_error: "Issue Type ID is required" }).uuid("Invalid issue type ID format")
export const issueField = z.string({ required_error: "Issue is required" }).min(3, "Issue description must be at least 3 characters long")

export const statusField = z.enum(["ACCEPTED", "REJECTED"], {
    required_error: "Status is missing",
    invalid_type_error: "Status must be ACCEPTED or REJECTED",
})


