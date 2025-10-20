import { z } from "zod";

export const SubCategorySchema = z.object({
    subCategoryId: z.string().min(1, "Subcategory ID is required"),
    name: z.string().min(1, "Subcategory name is required"),
});

export const ServicesSchema = z.object({
    categoryId: z.string().min(1, "Category ID is required"),
    name: z.string().min(1, "Category name is required"),
    subcategories: z.array(SubCategorySchema)
        .min(1, "At least one subcategory must be provided"),
});

export const UpdateProviderDataSchema = z.object({
    serviceCharge: z
        .number()
        .min(300, "Service charge must be at least 300")
        .max(500, "Service charge cannot exceed 500"),
    category: ServicesSchema,
});
