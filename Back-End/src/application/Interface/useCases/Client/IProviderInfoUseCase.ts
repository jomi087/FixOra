import { ProviderInfoInputDTO, ProviderInfoOutputDTO } from "../../../DTOs/ProviderInfoDTO";

export interface IProviderInfoUseCase{
    execute(input: ProviderInfoInputDTO ): Promise<ProviderInfoOutputDTO>
}