import { Category } from "../../domain/entities/CategoryEntity";

export interface GetLandingDataOutputDTO {
  categories: Partial<Category>[]
  // providers?: ProviderLandingDTO[];
  // blogs?: BlogLandingDTO[];
}