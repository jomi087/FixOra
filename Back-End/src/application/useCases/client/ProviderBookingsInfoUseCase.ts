import { IProviderRepository } from "../../../domain/interface/RepositoryInterface/IProviderRepository.js";
import { IUserRepository } from "../../../domain/interface/RepositoryInterface/IUserRepository.js";
import { Gender } from "../../../shared/Enums/Gender.js";
import { HttpStatusCode } from "../../../shared/Enums/HttpStatusCode.js";
import { Messages } from "../../../shared/Messages.js";
import { ProviderBookingsInfoDTO, ProviderBookingsInfoInputDTO, ProviderBookingsInfoOutputDTO } from "../../DTO's/ProviderBookingsInfoDTO.js";
import { IProviderBookingsInfoUseCase } from "../../Interface/useCases/Client/IProviderBookingsInfoUseCase.js";

const { INTERNAL_SERVER_ERROR } = HttpStatusCode
const { INTERNAL_ERROR } = Messages


export class ProviderBookingsInfoUseCase implements IProviderBookingsInfoUseCase{
    constructor(
        //private readonly providerRepository: IProviderRepository,
        private readonly userRepository : IUserRepository,

        
    ) { }
    
    async execute(input: ProviderBookingsInfoInputDTO ): Promise<ProviderBookingsInfoOutputDTO>{
        try {
            
            const {user ,provider, category,distanceFee} = await this.userRepository.findProviderBookingsById(input.id,input.coordinates)

            const mappedData: ProviderBookingsInfoDTO = {
                providerId: provider.providerId,
                user: {
                    userId: user.userId ,
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
                distanceFee : distanceFee
            }
            return mappedData

        } catch (error: any) {
            console.log(error)
            if (error.status && error.message) {
                throw error;
            }
            throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR };
        }
    }
    
}