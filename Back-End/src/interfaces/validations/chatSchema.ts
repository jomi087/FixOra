import { z } from "zod";
import { uuidField } from "./fields";

export const startChatSchema = z.object({
    userId: uuidField("PartnerId"),
});