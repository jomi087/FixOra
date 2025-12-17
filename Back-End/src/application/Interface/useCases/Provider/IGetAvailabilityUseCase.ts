import { getAvailabilityOutputDTO } from "../../../dtos/AvailabilityDTO";

export interface IGetAvailabilityUseCase{
    execute( providerUserId: string ):Promise<getAvailabilityOutputDTO[]>
}