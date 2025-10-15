import { z } from "zod";
import { PLATFORMS  } from "../../shared/const/constants";

export const FcmSchema = z.object({
    FcmToken: z.string().min(1, "FCM token is missing"),
    platform: z.enum(PLATFORMS),
});
