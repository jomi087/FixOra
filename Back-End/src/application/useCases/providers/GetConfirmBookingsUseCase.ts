import { IBookingRepository } from "../../../domain/interface/RepositoryInterface/IBookingRepository";
import { HttpStatusCode } from "../../../shared/Enums/HttpStatusCode";
import { Messages } from "../../../shared/Messages";
import { ConfirmBookingOutputDTO } from "../../DTO's/BookingDTO/BookingInfoDTO";
import { IGetConfirmBookingsUseCase } from "../../Interface/useCases/Provider/IGetConfirmBookingsUseCase";


const { INTERNAL_SERVER_ERROR } = HttpStatusCode;
const { INTERNAL_ERROR } = Messages;

export class GetConfirmBookingsUseCase implements IGetConfirmBookingsUseCase {
    constructor(
        private readonly _bookingRepository: IBookingRepository,
    ){}
    
    async execute(input : string): Promise<ConfirmBookingOutputDTO[]>{
        try {
            
            const bookings = await this._bookingRepository.findProviderConfirmBookingsById(input);
            if (!bookings.length) return [];

            const mappedData:ConfirmBookingOutputDTO[] = bookings.map((booking) => ({
                bookingId: booking.bookingId,
                scheduledAt: booking.scheduledAt,
                status: booking.status,
                acknowledgment: {
                    isWorkCompletedByProvider: booking.acknowledgment?.isWorkCompletedByProvider || false,
                    isWorkConfirmedByUser: booking.acknowledgment?.isWorkConfirmedByUser || false
                }
            }));

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


/*
import { IBookingRepository } from "../../../domain/interface/RepositoryInterface/IBookingRepository";
import { HttpStatusCode } from "../../../shared/Enums/HttpStatusCode";
import { Messages } from "../../../shared/Messages";
import { BookingInfoOutputDTO } from "../../DTO's/BookingDTO/BookingInfoDTO";
import { IGetConfirmBookingsUseCase } from "../../Interface/useCases/Provider/IGetConfirmBookingsUseCase";


const { INTERNAL_SERVER_ERROR } = HttpStatusCode;
const { INTERNAL_ERROR } = Messages;

import { BookingInfoOutputDTO } from "../../../DTO's/BookingDTO/BookingInfoDTO";

export interface IGetBookingInfoUseCase  {
    execute(input : string):Promise<BookingDetailsOutputDTO[]>
}


export class GetBookingInfoUseCase implements IGetBookingInfoUseCase {
    constructor(
        private readonly _bookingRepository: IBookingRepository,
    ){}
    
    async execute(input : string): Promise<BookingDetailsOutputDTO[]>{
        try {
            
            const bookings = await this._bookingRepository.findProviderConfirmBookingsById(input);
            if (!bookings.length) return [];
            const mappedData:BookingInfoOutputDTO[] = bookings.map(({ booking, category, subCategory, user }) => ({
                bookingId: booking.bookingId,
                user: {
                    userId: user.userId,
                    fname: user.fname,
                    lname: user.lname|| "",
                    location: user.location|| "N/A"
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
                    imageUrl: booking.acknowledgment?.imageUrl || "",
                    isWorkConfirmedByUser: booking.acknowledgment?.isWorkConfirmedByUser || false
                }
            }));

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

*/