import { ProviderBookingsInfoInputDTO, ProviderBookingsInfoOutputDTO } from "../../../DTO's/BookingDTO/ProviderBookingsInfoDTO.js";

export interface IProviderBookingsInfoUseCase{
    execute(input: ProviderBookingsInfoInputDTO ): Promise<ProviderBookingsInfoOutputDTO>
}