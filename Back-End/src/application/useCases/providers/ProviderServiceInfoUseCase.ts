import { IProviderRepository } from "../../../domain/interface/repositoryInterface/IProviderRepository";
import { Messages } from "../../../shared/const/Messages";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { AppError } from "../../../shared/errors/AppError";
import { ProviderServiceInfoOutputDTO } from "../../dtos/ProviderInfoDTO";
import { IProviderServiceInfoUseCase } from "../../interfacetemp/useCases/provider/IProviderServiceInfoUseCase";

const { NOT_FOUND } = HttpStatusCode;
const { NOT_FOUND_MSG } = Messages;


export class ProviderServiceInfoUseCase implements IProviderServiceInfoUseCase {
    constructor(
        private readonly _providerRepository: IProviderRepository
    ) { }

    async execute(providerUserId: string): Promise<ProviderServiceInfoOutputDTO> {

        try {
            const serviceData = await this._providerRepository.findProviderServiceInfoById(providerUserId);
            if (!serviceData) throw new AppError(NOT_FOUND, NOT_FOUND_MSG("Provider"));

            const { category, provider } = serviceData;

            const mappedData: ProviderServiceInfoOutputDTO = {
                providerId: provider.providerId,
                serviceCharge: provider.serviceCharge,
                category: category
            };

            return mappedData;

        } catch (error: unknown) {
            throw error;
        }
    }
}