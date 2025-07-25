import { Category } from "../../domain/entities/CategoryEntity.js";

export interface GetLandingDataOutputDTO {
  categories: Partial<Category>[]
  // providers?: ProviderLandingDTO[];
  // blogs?: BlogLandingDTO[];
}