import { Category } from "../../domain/entities/CategoryEntity";
import { UploadedFile } from "../../shared/types/common";
import { PaginationInputDTO, PaginationOutputDTO } from "./Common/PaginationDTO";

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

export interface GetServicesInputDTO extends PaginationInputDTO { }

export interface GetServicesOutputDTO extends PaginationOutputDTO<Partial<Category>> { }

export interface UpdateCategoryInputDTO {
  categoryId: string;
  name: string;
  description: string;
  imageFile: UploadedFile | null
}

export interface UpdateSubCategoryInputDTO {
  subCategoryId: string;
  name: string;
  description: string;
  imageFile: UploadedFile | null
}