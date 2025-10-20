// formValidations.ts
import { validateImage } from "./imageValidation";

export const validateCategoryName = (name: string): string | null => {
  name = name.trim();
  if (!name) return "Name is required.";
  if (name.length < 4) return "Name must have at least 4 characters.";
  return null;
};

export const validateDescription = (description: string): string | null => {
  description = description.trim();
  if (!description) return "Description is required.";
  return null;
};

export const validateCategoryImage = (file: File | null , imageSize : number ): string | null => {
  return validateImage(file,imageSize);
};

