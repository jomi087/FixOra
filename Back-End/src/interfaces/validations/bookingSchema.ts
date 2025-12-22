import { z } from "zod";
import {
    optionalStringField, dateTimeField, issueField,
    issueTypeIdField, providerIdField, providerUserIdField,
    providerResponseStatusField, bookingIdField
} from "./fields";
import { ProviderResponseStatus } from "../../shared/enumss/ProviderResponse";

export const bookingIdSchema = z.object({
    bookingId: bookingIdField,
});

export const bookingRequestSchema = z.object({
    providerId: providerIdField,
    providerUserId: providerUserIdField,
    scheduledAt: dateTimeField,
    issueTypeId: issueTypeIdField,
    issue: issueField
}).refine(
    (data) => {
        const bookingDateTime = new Date(data.scheduledAt);
        // Check if bookingDateTime is valid and in the future
        return !isNaN(bookingDateTime.getTime()) && bookingDateTime > new Date();
    },
    {
        message: "Slot is Un-Available",
        path: ["scheduledAt"],
    }
);
/********************************************************************************* */
export const bookingStatusSchema = z.object({
    action: providerResponseStatusField,
    reason: optionalStringField,
}).refine(
    (data) =>
        data.action === ProviderResponseStatus.ACCEPTED || (data.reason && data.reason.trim().length > 0), //truthy condition is false then trigger message
    {
        message: "Reason is required",
        path: ["reason"], // This will attach the error to the reason field
    }
);
/********************************************************************************* */

export const rescheduleBookingSchema = z.object({
    rescheduledAt: z.coerce.date()
        .refine(
            (data) => {
                const bookingDateTime = new Date(data);
                // Check if bookingDateTime is valid and in the future
                return !isNaN(bookingDateTime.getTime()) && bookingDateTime > new Date();
            },
            { message: "Date cannot be in the past" }

        )
});