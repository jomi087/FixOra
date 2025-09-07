
import { IBookingRepository } from "../../../domain/interface/RepositoryInterface/IBookingRepository";
import { HttpStatusCode } from "../../../shared/Enums/HttpStatusCode";
import { Messages } from "../../../shared/Messages";
import { jobDetailsOutputDTO } from "../../DTO's/BookingDTO/BookingInfoDTO";
import { IGetJobDetailsUseCase } from "../../Interface/useCases/Provider/IGetJobDetailsUseCase";


const { INTERNAL_SERVER_ERROR,NOT_FOUND } = HttpStatusCode;
const { INTERNAL_ERROR, NOT_FOUND_MSG } = Messages;


export class GetJobDetailsUseCase implements IGetJobDetailsUseCase {
    constructor(
        private readonly _bookingRepository: IBookingRepository,
    ){}
    
    async execute(input : string): Promise<jobDetailsOutputDTO>{
        try {
            
            const bookingDataInDetails = await this._bookingRepository.jobDetailsById(input);
            if (!bookingDataInDetails) {
                throw { status: NOT_FOUND, message: NOT_FOUND_MSG };
            };

            const { booking, category, subCategory, user } = bookingDataInDetails;
            
            const mappedData:jobDetailsOutputDTO = {
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
            if (error.status && error.message) {
                throw error;
            }
            throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR };
        }
    }
}

