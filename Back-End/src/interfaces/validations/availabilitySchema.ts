import { z } from "zod";
import { daySchemaField, ScheduleField } from "./fields";


export const workTimeSchema = z.object({
    schedule: ScheduleField
});

export const daySchema = z.object({
    day : daySchemaField
});

