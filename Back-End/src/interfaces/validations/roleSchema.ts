import { z } from "zod";
import { roleFiled } from "./fields.js";

export const roleSchema = z.object({
  role: roleFiled
});



