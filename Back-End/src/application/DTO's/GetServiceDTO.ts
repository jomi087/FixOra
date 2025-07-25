import { Category } from "../../domain/entities/CategoryEntity.js";
import { PaginationInputDTO, PaginationOutputDTO } from "./Common/PaginationDTO.js";

export interface GetServicesInputDTO extends PaginationInputDTO {}

export interface GetServicesOutputDTO extends PaginationOutputDTO<Partial<Category>> { }
