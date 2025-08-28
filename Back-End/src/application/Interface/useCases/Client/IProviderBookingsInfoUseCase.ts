import { ProviderBookingsInfoInputDTO, ProviderBookingsInfoOutputDTO } from "../../../DTO's/BookingDTO/ProviderBookingsInfoDTO";

export interface IProviderBookingsInfoUseCase{
    execute(input: ProviderBookingsInfoInputDTO ): Promise<ProviderBookingsInfoOutputDTO>
}