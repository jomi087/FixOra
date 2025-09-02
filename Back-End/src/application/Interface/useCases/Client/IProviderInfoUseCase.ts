import { ProviderInfoInputDTO, ProviderInfoOutputDTO } from "../../../DTO's/BookingDTO/ProviderInfoDTO";

export interface IProviderInfoUseCase{
    execute(input: ProviderInfoInputDTO ): Promise<ProviderInfoOutputDTO>
}