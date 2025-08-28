import { User } from "../../domain/entities/UserEntity";
import { PaginationInputDTO, PaginationOutputDTO } from "./Common/PaginationDTO";

export interface GetCustomersInputDTO extends PaginationInputDTO { }

export interface GetCustomersOutputDTO extends PaginationOutputDTO<Partial<User>> {}