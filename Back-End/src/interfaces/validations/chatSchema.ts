import { z } from "zod";
import { stringMinMax, uuidField } from "./fields";

export const startChatSchema = z.object({
    userId: uuidField("PartnerId"),
});


export const chatMessageSchema = z.object({
    content: stringMinMax(1,"Message cannot be empty", 5000, "Message is too long")
});

