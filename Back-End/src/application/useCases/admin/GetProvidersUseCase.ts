import { IProviderRepository } from "../../../domain/interface/repositoryInterface/IProviderRepository";
import { GetProvidersInputDTO, GetProvidersOutputDTO, ProviderDTO } from "../../dtos/GetProviderDTO";
import { IGetProvidersUseCase } from "../../Interface/useCases/admin/IGetProvidersUseCase";

export class GetProvidersUseCase implements IGetProvidersUseCase {
    constructor(
        private readonly _providerRepository: IProviderRepository,
    ) { }

    async execute(input: GetProvidersInputDTO): Promise<GetProvidersOutputDTO> {

        try {
            const { searchQuery, filter, currentPage, limit } = input;

            const { data, total } = await this._providerRepository.findProvidersWithFilters({ searchQuery, filter }, currentPage, limit);

            const mappedData: ProviderDTO[] = data.map(({ provider, service, user }) => ({
                providerId: provider.providerId,
                user: {
                    userId: user.userId,
                    fname: user.fname,
                    lname: user.lname || "",
                    email: user.email,
                    mobileNo: user.mobileNo || "N/A",
                    location: user.location!,
                },
                dob: provider.dob,
                gender: provider.gender,
                service: {
                    categoryId: service.categoryId,
                    name: service.name,
                    subcategories: service.subcategories
                },
                profileImage: provider.profileImage,
                serviceCharge: provider.serviceCharge,
                kyc: provider.kyc,
                isOnline: provider.isOnline,
            }));

            return {
                data: mappedData,
                total
            };

        } catch (error: unknown) {
            throw error;
        }
    }

}