import { ProviderInfoInputDTO, ProviderInfoOutputDTO } from "../../../dtos/ProviderInfoDTO";

export interface IProviderInfoUseCase{
    execute(input: ProviderInfoInputDTO ): Promise<ProviderInfoOutputDTO>
}