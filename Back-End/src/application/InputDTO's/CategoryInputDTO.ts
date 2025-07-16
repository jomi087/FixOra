export interface SubcategoryInputDTO {
  name: string;
  description: string;
  image: string; 
}

export interface CategoryInputDTO {
  name: string;
  description: string;
  image: string;
  subcategories: SubcategoryInputDTO[];
}