import { IBookingRepository } from "../../../domain/interface/repositoryInterface/IBookingRepository";
import { BookingHistoryInputDTO, BookingHistoryOutputDTO } from "../../dtos/booking/BookingHistoryDTO";
import { IBookingHistoryUseCase } from "../../interface/useCases/client/IBookingHistoryUseCase";

export class BookingHistoryUseCase implements IBookingHistoryUseCase {
    constructor(
        private readonly _bookingRepository: IBookingRepository,
    ) { }

    async execute(input: BookingHistoryInputDTO): Promise<BookingHistoryOutputDTO> {
        try {
            const { userId, currentPage, limit } = input;

            const bookings = await this._bookingRepository.findUserBookingHistoryById(
                userId,
                currentPage,
                limit,
            );

            const mappedData = bookings.data.map((booking) => ({
                bookingId: booking.bookingId,
                scheduledAt: booking.scheduledAt,
                status: booking.status,
            }));

            return {
                data: mappedData,
                total: bookings.total
            };

        } catch (error: unknown) {
            throw error;
        }
    }
}
