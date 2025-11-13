import { z } from "zod";
import { disputeStatus, stringMinMax } from "./fields";


export const disputeActionSchema = z.object({
    reason: stringMinMax(5, "Reason must be at least 5 characters", 500, "Reason too long"),
    status: z.enum(disputeStatus)
});