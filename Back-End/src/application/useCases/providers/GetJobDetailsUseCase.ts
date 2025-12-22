
import { IBookingRepository } from "../../../domain/interface/repositoryInterface/IBookingRepository";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { Messages } from "../../../shared/const/Messages";
import { jobDetailsOutputDTO } from "../../dtos/BookingDTO/BookingInfoDTO";
import { IGetJobDetailsUseCase } from "../../Interface/useCases/provider/IGetJobDetailsUseCase";
import { AppError } from "../../../shared/errors/AppError";


const { INTERNAL_SERVER_ERROR, NOT_FOUND } = HttpStatusCode;
const { NOT_FOUND_MSG, INTERNAL_ERROR, INVARIANT_VIOLATION_MISSING_FIELD } = Messages;


export class GetJobDetailsUseCase implements IGetJobDetailsUseCase {
    constructor(
        private readonly _bookingRepository: IBookingRepository,
    ) { }

    async execute(input: string): Promise<jobDetailsOutputDTO> {
        try {

            const bookingDataInDetails = await this._bookingRepository.jobDetailsById(input);
            if (!bookingDataInDetails) {
                throw new AppError(NOT_FOUND, NOT_FOUND_MSG("Booking-data"));
            };

            const { booking, category, subCategory, user } = bookingDataInDetails;
            if (!booking) throw new AppError(NOT_FOUND, NOT_FOUND_MSG("Booking-data"));
            if (!booking.paymentInfo) throw new AppError(INTERNAL_SERVER_ERROR, INTERNAL_ERROR, INVARIANT_VIOLATION_MISSING_FIELD("booking.paymentInfo"));

            const mappedData: jobDetailsOutputDTO = {
                bookingId: booking.bookingId!,
                user: {
                    userId: user.userId,
                    fname: user.fname,
                    lname: user.lname || "",
                    email: user.email,
                    location: booking.location!
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
                commission: booking.commission!,
                paymentInfo: {
                    mop: booking.paymentInfo.mop,
                    status: booking.paymentInfo.status,
                    paidAt: booking.paymentInfo.paidAt,
                    transactionId: booking.paymentInfo.transactionId,
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

