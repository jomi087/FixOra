import { z } from "zod";
import { Messages } from "../../shared/Messages.js";

export const kycStatus = z.object({
  action: z.enum(["Pending", "Approved", "Rejected"], {
    message: Messages.INVALID_ACTION
  }),
  reason: z.string().optional()
}).refine(
  (data) => data.action !== "Rejected" || (data.reason && data.reason.trim().length > 0),
  {
    message: Messages.REASON_REQUIRED_ON_REJECTION,
    path: ["reason"],
  }
);
