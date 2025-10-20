import { IProviderRepository } from "../../../domain/interface/RepositoryInterface/IProviderRepository";
import { Messages } from "../../../shared/const/Messages";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { ProviderServiceInfoOutputDTO } from "../../DTOs/ProviderInfoDTO";
import { IProviderServiceInfoUseCase } from "../../Interface/useCases/Provider/IProviderServiceInfoUseCase";

const { INTERNAL_SERVER_ERROR, NOT_FOUND } = HttpStatusCode;
const { INTERNAL_ERROR, PROVIDER_NOT_FOUND } = Messages;


export class ProviderServiceInfoUseCase implements IProviderServiceInfoUseCase {
    constructor(
        private readonly _providerRepository: IProviderRepository
    ) { }

    async execute(providerUserId: string): Promise<ProviderServiceInfoOutputDTO> {

        try {
            const serviceData = await this._providerRepository.findProviderServiceInfoById(providerUserId);
            if (!serviceData) throw { status: NOT_FOUND, message: PROVIDER_NOT_FOUND };

            const { category, provider } = serviceData;

            const mappedData:ProviderServiceInfoOutputDTO = {
                providerId: provider.providerId,
                serviceCharge: provider.serviceCharge,
                category : category
            };

            return mappedData;

        } catch (error) {
            console.log(error);
            if (error.status && error.message) {
                throw error;
            }
            throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR };
        }
    }
}