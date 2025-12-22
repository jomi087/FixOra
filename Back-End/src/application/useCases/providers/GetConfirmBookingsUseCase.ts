import { IBookingRepository } from "../../../domain/interface/repositoryInterface/IBookingRepository";
import { ConfirmBookingOutputDTO } from "../../dtos/BookingDTO/BookingInfoDTO";
import { IGetConfirmBookingsUseCase } from "../../interface/useCases/provider/IGetConfirmBookingsUseCase";



export class GetConfirmBookingsUseCase implements IGetConfirmBookingsUseCase {
    constructor(
        private readonly _bookingRepository: IBookingRepository,
    ) { }

    async execute(input: string): Promise<ConfirmBookingOutputDTO[]> {
        try {

            const bookings = await this._bookingRepository.findProviderConfirmBookingsById(input);
            if (!bookings.length) return [];

            const mappedData: ConfirmBookingOutputDTO[] = bookings.map((booking) => ({
                bookingId: booking.bookingId,
                scheduledAt: booking.scheduledAt,
                status: booking.status,
            }));

            return mappedData;

        } catch (error: unknown) {
            throw error;
        }

    }
}
