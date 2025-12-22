import { getAvailabilityOutputDTO } from "../../../dto/AvailabilityDTO";

export interface IGetAvailabilityUseCase{
    execute( providerUserId: string ):Promise<getAvailabilityOutputDTO[]>
}