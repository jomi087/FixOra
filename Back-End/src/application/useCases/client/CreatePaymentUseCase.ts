import { ICreatePaymentUseCase } from "../../Interface/useCases/Client/ICreatePaymentUseCase";
import { Messages } from "../../../shared/Messages";
import { HttpStatusCode } from "../../../shared/Enums/HttpStatusCode";
import { IPaymentService } from "../../../domain/interface/ServiceInterface/IPaymentService";
import { IBookingRepository } from "../../../domain/interface/RepositoryInterface/IBookingRepository";


const { INTERNAL_SERVER_ERROR, NOT_FOUND } = HttpStatusCode;
const { INTERNAL_ERROR, BOOKING_ID_NOT_FOUND } = Messages;


export class CreatePaymentUseCase implements ICreatePaymentUseCase {
    constructor(
        private readonly _paymentService: IPaymentService,
        private readonly _bookingRepository: IBookingRepository,
    ) {}
    
    async execute(bookingId: string): Promise<string> {
        try {
            let booking = await this._bookingRepository.findByBookingId(bookingId);
            if (!booking) throw { status: NOT_FOUND, message: BOOKING_ID_NOT_FOUND };

            const totalAmount = booking.pricing.baseCost + booking.pricing.distanceFee;

            return await this._paymentService.createPaymentIntent(booking.bookingId,totalAmount);
        } catch (error:any) {
            if (error.status && error.message) throw error;
            throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR };
        }
    }
}