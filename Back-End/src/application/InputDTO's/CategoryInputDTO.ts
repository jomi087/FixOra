export interface SubcategoryInputDTO {
  name: string;
  description: string;
  image: string; // A Cloudinary URL or uploaded path
}

export interface CategoryInputDTO {
  name: string;
  description: string;
  image: string;
  subcategories: SubcategoryInputDTO[];
}