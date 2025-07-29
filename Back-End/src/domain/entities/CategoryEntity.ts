export interface Subcategory {
  subCategoryId: string;
  name: string;
  description: string;
  image: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Category {
  categoryId: string 
  name: string;
  description: string;
  image: string;
  subcategories: Subcategory[];
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

