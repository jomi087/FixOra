import { ProviderInfoInputDTO, ProviderInfoOutputDTO } from "../../../DTO's/ProviderInfoDTO";

export interface IProviderInfoUseCase{
    execute(input: ProviderInfoInputDTO ): Promise<ProviderInfoOutputDTO>
}