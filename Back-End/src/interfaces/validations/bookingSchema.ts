import { z } from "zod";
import { fullDateField, issueField, issueTypeIdField, providerIdField, providerUserIdField, timeField } from "./fields.js";

export const bookingRequestSchema = z.object({
    providerId: providerIdField,
    providerUserId : providerUserIdField,
    fullDate: fullDateField,
    time: timeField,
    issueTypeId: issueTypeIdField,
    issue: issueField

});
