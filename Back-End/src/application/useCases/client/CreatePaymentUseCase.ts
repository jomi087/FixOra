import { ICreatePaymentUseCase } from "../../interfacetemp/useCases/client/ICreatePaymentUseCase";
import { Messages } from "../../../shared/const/Messages";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { IPaymentService } from "../../../domain/interface/serviceInterface/IPaymentService";
import { IBookingRepository } from "../../../domain/interface/repositoryInterface/IBookingRepository";
import { AppError } from "../../../shared/errors/AppError";


const { NOT_FOUND } = HttpStatusCode;
const { NOT_FOUND_MSG } = Messages;


export class CreatePaymentUseCase implements ICreatePaymentUseCase {
    constructor(
        private readonly _paymentService: IPaymentService,
        private readonly _bookingRepository: IBookingRepository,
    ) { }

    async execute(bookingId: string): Promise<string> {
        try {
            let booking = await this._bookingRepository.findByBookingId(bookingId);
            if (!booking) throw new AppError(NOT_FOUND, NOT_FOUND_MSG("Booking"));

            const totalAmount = booking.pricing.baseCost + booking.pricing.distanceFee;

            return await this._paymentService.createPaymentIntent(booking.bookingId, totalAmount);

        } catch (error: unknown) {
            throw error;
        }
    }
}