import { IProviderRepository } from "../../../domain/interface/RepositoryInterface/IProviderRepository.js";
import { IUserRepository } from "../../../domain/interface/RepositoryInterface/IUserRepository.js";
import { Gender } from "../../../shared/constant/Gender.js";
import { HttpStatusCode } from "../../../shared/constant/HttpStatusCode.js";
import { Messages } from "../../../shared/constant/Messages.js";
import { ActiveProviderDTO, GetActiveProvidersInputDTO, GetActiveProvidersOutputDTO } from "../../DTO's/GetActiveProvidersDTO.js";
import { IGetActiveProvidersUseCase } from "../../Interface/useCases/Client/IGetActiveProvidersUseCase.js";


const { INTERNAL_SERVER_ERROR } = HttpStatusCode
const { INTERNAL_ERROR } = Messages

export class GetActiveProvidersUseCase implements IGetActiveProvidersUseCase{
    constructor(
        private readonly providerRepository : IProviderRepository,
    ) { }
    
    async execute(input: GetActiveProvidersInputDTO): Promise<GetActiveProvidersOutputDTO>{ //GetActiveProvidersOutputDTO
        try {
            const { searchQuery, filter, currentPage, limit, extraFilter,coordinates } = input

            const { data, total } = await this.providerRepository.findActiveProvidersWithFilters({ searchQuery, filter, extraFilter, coordinates }, currentPage, limit)
            
            console.log("data data",data)

            const mappedData: ActiveProviderDTO[] = data.map(({provider, user, category,averageRating,totalRatings }) => ({
                providerId: provider.providerId ?? "",
                user: {
                    userId: user.userId ?? "",
                    fname: user.fname ?? "",
                    lname: user.lname ?? "",
                    mobileNo: user.mobileNo ?? "",
                    location: {
                        houseinfo: user.location?.houseinfo ?? "",
                        street: user.location?.street ?? "",
                        district: user.location?.district ?? "",
                        city: user.location?.city ?? "",
                        locality: user.location?.locality ?? "",
                        state: user.location?.state ?? "",
                        postalCode: user.location?.postalCode ?? "",
                        coordinates: {
                            latitude: user.location?.coordinates?.latitude ?? 0,
                            longitude: user.location?.coordinates?.longitude ?? 0
                        }
                    }
                },
                gender: provider.gender ?? Gender.Other,
                service: {
                    categoryId: category.categoryId ?? "",
                    name: category.name ?? "",
                    subcategories: (category.subcategories ?? []).map(sub => ({
                        subCategoryId: sub.subCategoryId ?? "",
                        name: sub.name ?? ""
                    }))
                },
                profileImage: provider.profileImage ?? "",
                serviceCharge: provider.serviceCharge ?? 500,
                isOnline: provider.isOnline ?? false,
                averageRating: averageRating ?? 0 ,
                totalRatings: totalRatings ?? 0
            }));

            //console.log(mappedData)          
            return {
                data:mappedData,
                total,
            };
            
        } catch (error: any) {
            console.log(error)
            if (error.status && error.message) {
                throw error;
            }
            throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR };
        }
    }
    
}