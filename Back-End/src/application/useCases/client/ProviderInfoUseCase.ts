import { IUserRepository } from "../../../domain/interface/repositoryInterface/IUserRepository";
import { Gender } from "../../../shared/enums/Gender";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { Messages } from "../../../shared/const/Messages";
import { ProviderInfoDTO, ProviderInfoInputDTO, ProviderInfoOutputDTO } from "../../dtos/ProviderInfoDTO";
import { IProviderInfoUseCase } from "../../interface/useCases/client/IProviderInfoUseCase";
import { AppError } from "../../../shared/errors/AppError";

const { NOT_FOUND } = HttpStatusCode;
const { NOT_FOUND_MSG } = Messages;


export class ProviderInfoUseCase implements IProviderInfoUseCase {
    constructor(
        private readonly _userRepository: IUserRepository,
    ) { }

    async execute(input: ProviderInfoInputDTO): Promise<ProviderInfoOutputDTO> {
        try {
            const providerData = await this._userRepository.findProviderInfoById(input.id, input.coordinates);

            if (!providerData) {
                throw new AppError(NOT_FOUND, NOT_FOUND_MSG("Provider"));
            }

            const { user, provider, category, booking, availability, distanceFee } = providerData;

            const mappedData: ProviderInfoDTO = {
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
                bookings: booking.map(bk => ({
                    bookingId: bk.bookingId,
                    scheduledAt: bk.scheduledAt,
                    status: bk.status,
                })),
                availability: availability.workTime,
                profileImage: provider.profileImage,
                serviceCharge: provider.serviceCharge,
                isOnline: provider.isOnline,
                distanceFee: distanceFee,
            };
            return mappedData;

        } catch (error: unknown) {
            throw error;
        }
    }

}