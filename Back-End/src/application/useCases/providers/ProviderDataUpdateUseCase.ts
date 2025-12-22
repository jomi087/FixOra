import { IProviderRepository } from "../../../domain/interface/repositoryInterface/IProviderRepository";
import { Messages } from "../../../shared/const/Messages";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { AppError } from "../../../shared/errors/AppError";
import { ProviderServiceInfoInputDTO, ProviderServiceInfoOutputDTO } from "../../dtos/ProviderInfoDTO";
import { IProviderDataUpdateUseCase } from "../../Interface/useCases/providerTemp/IProviderDataUpdateUseCase";

const { NOT_FOUND } = HttpStatusCode;
const { NOT_FOUND_MSG } = Messages;


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
            if (!providerUpdatedData) throw new AppError(NOT_FOUND, NOT_FOUND_MSG("Provider"));

            const serviceData = await this._providerRepository.findProviderServiceInfoById(providerUpdatedData.userId);
            if (!serviceData) throw new AppError(NOT_FOUND, NOT_FOUND_MSG("Provider"));

            const { category: updatedCategory, provider } = serviceData;

            const mappedData: ProviderServiceInfoOutputDTO = {
                providerId: provider.providerId,
                serviceCharge: provider.serviceCharge,
                category: updatedCategory
            };

            return mappedData;

        } catch (error: unknown) {
            throw error;
        }
    }
}