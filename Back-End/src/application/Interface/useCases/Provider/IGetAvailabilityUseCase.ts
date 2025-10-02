import { getAvailabilityOutputDTO } from "../../../DTO's/AvailabilityDTO";

export interface IGetAvailabilityUseCase{
    execute( providerUserId: string ):Promise<getAvailabilityOutputDTO[]>
}