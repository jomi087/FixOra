import { IBookingRepository } from "../../../domain/interface/RepositoryInterface/IBookingRepository";
import { HttpStatusCode } from "../../../shared/Enums/HttpStatusCode";
import { Messages } from "../../../shared/const/Messages";
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
            }));

            return  mappedData;

        } catch (error) {
            console.log(error,"dkd");
            if (error.status && error.message) {
                throw error;
            }
            throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR };
        }
    }
}
