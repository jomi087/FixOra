export interface SubcategoryDTO {
  subCategoryId: string;
  name: string;
  description: string;
  image: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CategoryDTO {
  categoryId: string 
  name: string;
  description: string;
  image: string;
  subcategories: SubcategoryDTO[];
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}