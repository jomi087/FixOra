import { Category } from "../../domain/entities/CategoryEntity";

export interface GetLandingDataOutputDTO {
  categories: Partial<Category>[]
  providers: {
    providerUserId: string;
    providerImage: string
  }[];
  // blogs?: BlogLandingDTO[];
}