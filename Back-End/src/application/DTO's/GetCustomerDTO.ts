import { User } from "../../domain/entities/UserEntity.js";
import { PaginationInputDTO, PaginationOutputDTO } from "./Common/PaginationDTO.js";

export interface GetCustomersInputDTO extends PaginationInputDTO { }

export interface GetCustomersOutputDTO extends PaginationOutputDTO<Partial<User>> {}