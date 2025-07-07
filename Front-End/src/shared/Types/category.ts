export type Subcategory = {
  subCategoryId : string
  name: string;
  description: string;
  image: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type Category = {
  categoryId: string;
  name: string;
  description: string;
  image: string;
  subcategories: Subcategory[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
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

