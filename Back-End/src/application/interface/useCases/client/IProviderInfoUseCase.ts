import { ProviderInfoInputDTO, ProviderInfoOutputDTO } from "../../../dto/ProviderInfoDTO";

export interface IProviderInfoUseCase{
    execute(input: ProviderInfoInputDTO ): Promise<ProviderInfoOutputDTO>
}