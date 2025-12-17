import { z } from "zod";
import { Messages } from "../constant";

//Basic
export const validateImage = (file: File | null, maxSizeInMB: number): string | null => {
  if (!file) return "Please select an image.";
    
  const validTypes = ["image/jpeg", "image/png", "image/jpg"];

  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  if (!validTypes.includes(file.type)) {
    return "Only JPEG, PNG, or JPG images are allowed.";
  }
  if (file.size > maxSizeInBytes) {
    return `Image size should not exceed ${maxSizeInMB}MB.`;
  }
  return null;
};

//zod
export const imageValidatorField = (maxSizeInMB: number = 5, msg: string) =>
  z
    .instanceof(File, { message: `${msg} is required` })
    .refine(
      (file) => ["image/jpeg", "image/png", "image/jpg"].includes(file.type),
      { message: Messages.IMAGE_TYPE_INVALID }
    )
    .refine(
      (file) => file.size <= maxSizeInMB * 1024 * 1024,
      { message: `Image size should not exceed ${maxSizeInMB}MB.` }
    );
