import { IUserRepository } from "../../../domain/interface/RepositoryInterface/IUserRepository";
import { Gender } from "../../../shared/enums/Gender";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { Messages } from "../../../shared/const/Messages";
import { ProviderInfoDTO, ProviderInfoInputDTO, ProviderInfoOutputDTO } from "../../DTO's/ProviderInfoDTO";
import { IProviderInfoUseCase } from "../../Interface/useCases/Client/IProviderInfoUseCase";

const { INTERNAL_SERVER_ERROR,NOT_FOUND } = HttpStatusCode;
const { INTERNAL_ERROR ,PROVIDER_NOT_FOUND } = Messages;


export class ProviderInfoUseCase implements IProviderInfoUseCase{
    constructor(
        private readonly _userRepository : IUserRepository, 
    ) { }
    
    async execute(input: ProviderInfoInputDTO ): Promise<ProviderInfoOutputDTO>{
        try { 
            const providerData = await this._userRepository.findProviderInfoById(input.id,input.coordinates);
            
            if (!providerData) {
                throw { status: NOT_FOUND, message: PROVIDER_NOT_FOUND }; 
            }

            const { user, provider, category, booking, availability, distanceFee } = providerData;
            
            const mappedData: ProviderInfoDTO = {
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
                bookings:booking.map(bk => ({
                    bookingId: bk.bookingId,
                    scheduledAt : bk.scheduledAt,
                    status: bk.status,
                })),
                availability : availability.workTime,
                profileImage: provider.profileImage,
                serviceCharge: provider.serviceCharge,
                isOnline: provider.isOnline, 
                distanceFee : distanceFee,
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