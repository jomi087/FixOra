import { getAvailabilityOutputDTO } from "../../../DTOs/AvailabilityDTO";

export interface IGetAvailabilityUseCase{
    execute( providerUserId: string ):Promise<getAvailabilityOutputDTO[]>
}