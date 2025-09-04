
import { IBookingRepository } from "../../../domain/interface/RepositoryInterface/IBookingRepository";
import { HttpStatusCode } from "../../../shared/Enums/HttpStatusCode";
import { Messages } from "../../../shared/Messages";
import { BookingDetailsOutputDTO } from "../../DTO's/BookingDTO/BookingInfoDTO";
import { IGetBookingDetailsUseCase } from "../../Interface/useCases/Provider/IGetBookingDetailsUseCase";


const { INTERNAL_SERVER_ERROR,NOT_FOUND } = HttpStatusCode;
const { INTERNAL_ERROR, NOT_FOUND_MSG } = Messages;


export class GetBookingDetailsUseCase implements IGetBookingDetailsUseCase {
    constructor(
        private readonly _bookingRepository: IBookingRepository,
    ){}
    
    async execute(input : string): Promise<BookingDetailsOutputDTO>{
        try {
            
            const bookingDataInDetails = await this._bookingRepository.ConfirmBookingsDetailsById(input);
            if (!bookingDataInDetails) {
                throw { status: NOT_FOUND, message: NOT_FOUND_MSG };
            };

            const { booking, category, subCategory, user } = bookingDataInDetails;
            
            const mappedData:BookingDetailsOutputDTO = {
                bookingId: booking.bookingId,
                user: {
                    userId: user.userId,
                    fname: user.fname,
                    lname: user.lname || "",
                    email : user.email,
                    location: user.location
                },
                scheduledAt: booking.scheduledAt,
                category: {
                    categoryId: category.categoryId,
                    name: category.name,
                    subCategory: {
                        subCategoryId: subCategory.subCategoryId,
                        name : subCategory.name
                    }
                },
                issue: booking.issue,
                status: booking.status,
                pricing: {
                    baseCost: booking.pricing.baseCost,
                    distanceFee : booking.pricing.distanceFee
                },
                acknowledgment: {
                    isWorkCompletedByProvider: booking.acknowledgment?.isWorkCompletedByProvider || false,
                    imageUrl: booking.acknowledgment?.imageUrl || [] ,
                    isWorkConfirmedByUser: booking.acknowledgment?.isWorkConfirmedByUser || false
                }
            };

            return  mappedData;

        } catch (error: any) {
            console.log(error,"dkd");
            if (error.status && error.message) {
                throw error;
            }
            throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR };
        }
    }
}

