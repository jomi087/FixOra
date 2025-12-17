import { IUserRepository } from "../../../domain/interface/RepositoryInterface/IUserRepository";
import { Gender } from "../../../shared/enums/Gender";
import { ActiveProviderDTO, GetActiveProvidersInputDTO, GetActiveProvidersOutputDTO } from "../../dtos/GetActiveProvidersDTO";
import { IGetActiveProvidersUseCase } from "../../Interface/useCases/Client/IGetActiveProvidersUseCase";


export class GetActiveProvidersUseCase implements IGetActiveProvidersUseCase {
    constructor(
        private readonly _userRepository: IUserRepository

    ) { }

    async execute(input: GetActiveProvidersInputDTO): Promise<GetActiveProvidersOutputDTO> { //GetActiveProvidersOutputDTO
        try {
            const { searchQuery, filter, currentPage, limit, extraFilter, coordinates } = input;

            const { data, total } = await this._userRepository.findActiveProvidersWithFilters({ searchQuery, filter, extraFilter, coordinates }, currentPage, limit);

            const mappedData: ActiveProviderDTO[] = data.map(({ provider, user, category, averageRating, totalRatings }) => ({
                providerId: provider.providerId,
                user: {
                    userId: user.userId,
                    fname: user.fname,
                    lname: user.lname,
                },
                gender: provider.gender ?? Gender.Other,
                service: {
                    categoryId: category.categoryId,
                    name: category.name,
                    subcategories: (category.subcategories).map(sub => ({
                        subCategoryId: sub.subCategoryId,
                        name: sub.name
                    }))
                },
                profileImage: provider.profileImage,
                serviceCharge: provider.serviceCharge,
                isOnline: provider.isOnline,
                averageRating: averageRating,
                totalRatings: totalRatings
            }));

            return {
                data: mappedData,
                total,
            };

        } catch (error: unknown) {
            throw error;
        }
    }

}