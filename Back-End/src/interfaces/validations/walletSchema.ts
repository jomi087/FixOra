import { z } from "zod";

export const addFundsSchema = z.object({
    amount: z.coerce //automatically convert the input into the target type before validating it
        .number() // target
        .positive("Amount must be greater than 0") //validate
        .max(50000, "Amount cannot exceed ₹50,000"), //validate
});

