import { IProviderRepository } from "../../../domain/interface/RepositoryInterface/IProviderRepository";
import { Messages } from "../../../shared/const/Messages";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { ProviderServiceInfoInputDTO, ProviderServiceInfoOutputDTO } from "../../DTOs/ProviderInfoDTO";
import { IProviderDataUpdateUseCase } from "../../Interface/useCases/Provider/IProviderDataUpdateUseCase";

const { INTERNAL_SERVER_ERROR, NOT_FOUND } = HttpStatusCode;
const { INTERNAL_ERROR, PROVIDER_NOT_FOUND } = Messages;


export class ProviderDataUpdateUseCase implements IProviderDataUpdateUseCase {
    constructor(
        private readonly _providerRepository: IProviderRepository
    ) { }

    async execute(input: ProviderServiceInfoInputDTO): Promise<ProviderServiceInfoOutputDTO> {
        try {
            const { providerUserId, serviceCharge, category } = input;

            const specializationIds = category.subcategories.map((sub) => sub.subCategoryId);
            const providerUpdatedData = await this._providerRepository.updateProviderService(providerUserId, {
                serviceCharge,
                specializationIds,
            });
            if (!providerUpdatedData) throw { status: NOT_FOUND, message: PROVIDER_NOT_FOUND };

            const serviceData = await this._providerRepository.findProviderServiceInfoById(providerUpdatedData.userId);
            if (!serviceData) throw { status: NOT_FOUND, message: PROVIDER_NOT_FOUND };

            const { category: updatedCategory, provider } = serviceData;

            const mappedData: ProviderServiceInfoOutputDTO = {
                providerId: provider.providerId,
                serviceCharge: provider.serviceCharge,
                category: updatedCategory
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