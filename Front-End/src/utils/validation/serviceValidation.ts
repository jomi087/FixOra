import type { Services } from "@/shared/types/user";
import { Messages } from "../constant";

export const serviceChargeValidation = (amount: number | null): string | null => {
  if (amount === null || amount === undefined) return "Field can't be empty";
  if (typeof amount !== "number" || isNaN(amount)) return "Invalid input";
  if (!(amount >= 300 && amount <= 500)) return Messages.SERVICE_CHARGE_RANGE;
  return null;
};

export const serviceAndSpecializationValidation = (service: Services | null) => {
  if (service == null) return "Invalid Format";
  if (!Array.isArray(service.subcategories) || service.subcategories.length === 0)
    return "Field can't be empty";
  return null;
};