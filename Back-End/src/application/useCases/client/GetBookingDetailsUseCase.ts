
import { IBookingRepository } from "../../../domain/interface/RepositoryInterface/IBookingRepository";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { Messages } from "../../../shared/const/Messages";
import { BookingDetailsOutputDTO } from "../../dtos/BookingDTO/BookingInfoDTO";
import { IGetBookingDetailsUseCase } from "../../Interface/useCases/Client/IGetBookingDetailsUseCase";
import { AppError } from "../../../shared/errors/AppError";

const { NOT_FOUND, INTERNAL_SERVER_ERROR } = HttpStatusCode;
const { NOT_FOUND_MSG, INTERNAL_ERROR, INVARIANT_VIOLATION_MISSING_FIELD } = Messages;

export class GetBookingDetailsUseCase implements IGetBookingDetailsUseCase {
    constructor(
        private readonly _bookingRepository: IBookingRepository,
    ) { }

    async execute(input: string): Promise<BookingDetailsOutputDTO> {
        try {

            const bookingDataInDetails = await this._bookingRepository.BookingsDetailsById(input);
            if (!bookingDataInDetails) {
                throw new AppError(NOT_FOUND, NOT_FOUND_MSG("Booking-Data"));
            };

            const { userProvider, provider, category, subCategory, booking } = bookingDataInDetails;

            if (!booking.paymentInfo)  throw new AppError(INTERNAL_SERVER_ERROR, INTERNAL_ERROR, INVARIANT_VIOLATION_MISSING_FIELD("booking.paymentInfo"));

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


        } catch (error: unknown) {
            throw error;
        }
    }
}

