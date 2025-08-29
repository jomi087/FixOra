import { IUserRepository } from "../../../domain/interface/RepositoryInterface/IUserRepository";
import { Gender } from "../../../shared/Enums/Gender";
import { HttpStatusCode } from "../../../shared/Enums/HttpStatusCode";
import { Messages } from "../../../shared/Messages";
import { ProviderBookingsInfoDTO, ProviderBookingsInfoInputDTO, ProviderBookingsInfoOutputDTO } from "../../DTO's/BookingDTO/ProviderBookingsInfoDTO";
import { IProviderBookingsInfoUseCase } from "../../Interface/useCases/Client/IProviderBookingsInfoUseCase";

const { INTERNAL_SERVER_ERROR,NOT_FOUND } = HttpStatusCode;
const { INTERNAL_ERROR ,PROVIDER_NOT_FOUND } = Messages;


export class ProviderBookingsInfoUseCase implements IProviderBookingsInfoUseCase{
    constructor(
        private readonly _userRepository : IUserRepository, 
    ) { }
    
    async execute(input: ProviderBookingsInfoInputDTO ): Promise<ProviderBookingsInfoOutputDTO>{
        try { 
            const providerData = await this._userRepository.findProviderBookingsById(input.id,input.coordinates);
            
            if (!providerData) {
                throw { status: NOT_FOUND, message: PROVIDER_NOT_FOUND }; 
            }

            const { user, provider, category, booking, distanceFee } = providerData;

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
                bookings:booking.map(bk => ({
                    bookingId: bk.bookingId,
                    scheduledAt : bk.scheduledAt,
                    status: bk.status,
                })),
                profileImage: provider.profileImage,
                serviceCharge: provider.serviceCharge,
                isOnline: provider.isOnline, 
                distanceFee : distanceFee,
            };
            return mappedData;
        } catch (error: any) {
            console.log(error);
            if (error.status && error.message) {
                throw error;
            }
            throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR };
        }
    }
    
}