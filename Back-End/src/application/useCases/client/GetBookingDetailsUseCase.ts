
import { IBookingRepository } from "../../../domain/interface/RepositoryInterface/IBookingRepository";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { Messages } from "../../../shared/const/Messages";
import { BookingDetailsOutputDTO } from "../../DTOs/BookingDTO/BookingInfoDTO";
import { IGetBookingDetailsUseCase } from "../../Interface/useCases/Client/IGetBookingDetailsUseCase";

const { INTERNAL_SERVER_ERROR, NOT_FOUND } = HttpStatusCode;
const { INTERNAL_ERROR, NOT_FOUND_MSG } = Messages;

export class GetBookingDetailsUseCase implements IGetBookingDetailsUseCase {
    constructor(
        private readonly _bookingRepository: IBookingRepository,
    ) { }

    async execute(input: string): Promise<BookingDetailsOutputDTO> {
        try {

            const bookingDataInDetails = await this._bookingRepository.BookingsDetailsById(input);
            if (!bookingDataInDetails) {
                throw { status: NOT_FOUND, message: NOT_FOUND_MSG };
            };

            const { userProvider, provider, category, subCategory, booking } = bookingDataInDetails;

            if (!booking.paymentInfo) throw { status: NOT_FOUND, message: NOT_FOUND_MSG };

            const mappedData: BookingDetailsOutputDTO = {
                bookingId: booking.bookingId!,
                providerUser: {
                    providerId: provider.providerId,
                    providerUserId: userProvider.userId,
                    fname: userProvider.fname,
                    lname: userProvider.lname || "",
                    email: userProvider.email,
                    image: provider.profileImage,
                },
                scheduledAt: booking.scheduledAt!,
                category: {
                    categoryId: category.categoryId,
                    name: category.name,
                    subCategory: {
                        subCategoryId: subCategory.subCategoryId,
                        name: subCategory.name
                    }
                },
                issue: booking.issue!,
                status: booking.status!,
                pricing: {
                    baseCost: booking.pricing!.baseCost,
                    distanceFee: booking.pricing!.distanceFee
                },
                paymentInfo: {
                    mop: booking.paymentInfo?.mop,
                    status: booking.paymentInfo.status,
                    paidAt: booking.paymentInfo?.paidAt,
                    transactionId: booking.paymentInfo?.transactionId,
                    reason: booking.paymentInfo?.reason,
                },
                workProof: booking.workProof,
                diagnosed: {
                    description: booking.diagnosed?.description!,
                    replaceParts: booking.diagnosed?.replaceParts
                }
            };
            return mappedData;


        } catch (error) {
            if (error.status && error.message) {
                throw error;
            }
            throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR };
        }
    }
}

