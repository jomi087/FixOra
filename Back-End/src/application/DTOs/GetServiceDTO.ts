import { Category } from "../../domain/entities/CategoryEntity";
import { PaginationInputDTO, PaginationOutputDTO } from "./Common/PaginationDTO";

export interface GetServicesInputDTO extends PaginationInputDTO {}

export interface GetServicesOutputDTO extends PaginationOutputDTO<Partial<Category>> { }
