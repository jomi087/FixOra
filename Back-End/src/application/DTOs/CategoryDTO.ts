export interface SubCategory {
  subCategoryId: string;
  name: string;
  description: string;
  image: string;
  isActive: boolean;
}

export interface CategoryDTO {
  categoryId: string;
  name: string;
  description: string;
  image: string;
  isActive: boolean;
  subcategories: SubCategory[];
}

export type CreateSubCategoryInput = Omit<SubCategory, "subCategoryId" | "isActive">;

export interface CreateCategoryInputDTO
  extends Omit<CategoryDTO, "categoryId" | "isActive" | "subcategories"> {
  subcategories: CreateSubCategoryInput[];
}

export interface ActiveCategoryOutputDTO extends CategoryDTO { }

export interface ShortCategoryOutputDTO {
  categoryId: string;
  name: string;
  subcategories: {
    subCategoryId: string;
    name: string;
  }[];
}
