import { z } from "zod";

export const diagnoseSchema = z.object({
    bookingId: z.string().nonempty("Booking ID is required"),

    diagnose: z
        .string()
        .trim()
        .min(3, "Diagnosis must be at least 3 characters long"),

    parts: z
        .array(
            z.object({
                name: z.string().nonempty("Part name is required"),
                cost: z.preprocess(
                    (val) => {
                        if (val === "" || val === null || val === undefined) return undefined;
                        const num = Number(val);
                        return isNaN(num) ? undefined : num;
                    },
                    z.number().positive("Price must be positive")
                ),
            })
        )
        .optional()
});