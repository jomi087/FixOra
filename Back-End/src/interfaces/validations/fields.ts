import { z } from "zod";
import { ProviderResponseStatus } from "../../shared/Enums/ProviderResponse";
import { RoleEnum } from "../../shared/Enums/Roles";
import { KYCStatus } from "../../shared/Enums/KYCstatus";
import { BookingStatus } from "../../shared/Enums/BookingStatus";
import { days, leaveOptions } from "../../shared/const/constants";

export const optionalStringField = z.string().optional();

export const firstNameField = z.string().trim().min(3, "First name is required, minimum 4 Characters");
export const lastNameField = z.string().trim().min(2, "Last name is required, minimum 2 Characters");
export const emailField = z.string().trim().email("Invalid email format");
export const mobileField = z.string().trim().regex(/^[1-9]\d{9}$/, "Invalid mobile number"); //change 1 to 6 later
export const passwordField = z.string().trim().min(10, "Password must be at least 10 characters");
export const roleField = z.enum(RoleEnum, { message: "Role is required", });
export const kycField = z.enum(KYCStatus, { message: "KYC status is required" });

export const houseInfoField = z.string();
export const streetField = z.string();
export const districtField = z.string().min(1, "Address invalid missing District field");
export const cityField = z.string().min(1, "Address invalid missing City field");
export const localityField = z.string().min(1, "Address invalid missing Locality field");
export const stateField = z.string().min(1, "Address invalid missing state field");
export const postalCodeField = z.string().min(6, "Address invalid, Postal code is too short").max(10, "Address indvalid, Postal code is too long");

export const latitudeField = z.number().min(-90).max(90);
export const longitudeField = z.number().min(-180).max(180);

export const providerIdField = z
    .uuid({ message: "Invalid provider ID format" })
    .refine(val => !!val, { message: "Provider info is missing" });

export const providerUserIdField = z
    .uuid({ message: "Invalid provider ID format" })
    .refine(val => !!val, { message: "Provider info is missing" });

export const bookingIdField = z
    .uuid({ message: "Invalid booking ID format" })
    .refine(val => !!val, { message: "Booking info is missing" });

export const dateTimeField = z.iso
    .datetime({ message: "DateTime must be a valid format" })
    .refine(val => !!val, { message: "Date & Time is required" });

export const issueTypeIdField = z
    .uuid({ message: "Invalid issue type ID format" })
    .refine(val => !!val, { message: "Issue Type ID is required" });

export const issueField = z.string()
    .min(3, { message: "Issue description must be at least 3 characters long" })
    .refine(val => !!val, { message: "Issue is required" });

export const bookingStatusField = z
    .enum(BookingStatus, { message: "BookingStatus missing", })
    .refine((val) => val !== BookingStatus.PENDING, { message: "BookingStatus cannot be Pending" });


export const providerResponseStatusField = z
    .enum(ProviderResponseStatus, { message: "Provider Response is missing" })
    .refine((val) => val !== ProviderResponseStatus.PENDING, { message: "Provider Response cannot be Pending" });

export const workTimeSchemaField = z.record(
    z.enum(days),
    z.array(z
        .string()
        .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
            message: "Time must be in HH:mm format (24-hour)",
        })
    ).nonempty({ message: "Each day must have at least one slot" })
);

export const daySchemaField = z.enum(days);
export const leaveOptionField = z.enum(leaveOptions);

export const TimeSlotField = z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
        message: "Time must be in HH:mm format (24-hour)",
    });

export const DayScheduleField = z.object({
    slots: z.array(TimeSlotField).nonempty({
        message: "Each day must have at least one slot",
    }),
    active: z.boolean(),
});

export const ScheduleField = z.record(daySchemaField, DayScheduleField);
