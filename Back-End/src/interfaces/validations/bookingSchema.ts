import { z } from "zod";
import { optionalStringField, fullDateField, issueField, issueTypeIdField, providerIdField, providerUserIdField, statusField, timeField } from "./fields.js";

export const bookingRequestSchema = z.object({
    providerId: providerIdField,
    providerUserId : providerUserIdField,
    fullDate: fullDateField,
    time: timeField,
    issueTypeId: issueTypeIdField,
    issue: issueField
}).refine(
  (data) => {
  // Parse fullDate and time to a Date object
    const [day, month, year] = data.fullDate.split("-").map(Number);
    const [hours, minutes] = data.time.split(":").map(Number);
    const bookingDateTime = new Date(year, month - 1, day, hours, minutes);

    // Check if bookingDateTime is valid and in the future
    // console.log(`Date.now()->${Date.now()} ----- converted ${new Date(Date.now())}`)
    return bookingDateTime.getTime() > Date.now();
  },
  {
    message: "Slot is Un-Available",
    path: ["fullDate", "time"], // attach error to these fields
  }
)
/********************************************************************************* */
export const bookingStatusSchema = z.object({
  status:statusField,
  reason: optionalStringField,
}).refine(
  (data) =>
    data.status === "ACCEPTED" || (data.reason && data.reason.trim().length > 0), //truthy condition is false then trigger message
  {                                                                     
    message: "Reason is required when status is REJECTED",
    path: ["reason"], // This will attach the error to the reason field
  }
);
/********************************************************************************* */
