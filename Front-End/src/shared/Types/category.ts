export type MainCategory = {
  categoryId: string;
  name: string;
  description: string;
  image: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type Subcategory = {
  subCategoryId : string
  name: string;
  description: string;
  image: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type Category = MainCategory &  {
  subcategories: Subcategory[];
};

export type CategoryFormInput = {
  name: string;
  description: string;
  image: File | null;
  subcategories: {
    name: string;
    description: string;
    image: File | null;
  }[];
};

