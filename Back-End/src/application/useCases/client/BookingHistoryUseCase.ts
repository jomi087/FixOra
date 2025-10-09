import { IBookingRepository } from "../../../domain/interface/RepositoryInterface/IBookingRepository";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { Messages } from "../../../shared/const/Messages";
import { BookingHistoryInputDTO, BookingHistoryOutputDTO } from "../../DTO's/BookingDTO/BookingHistoryDTO";
import { IBookingHistoryUseCase } from "../../Interface/useCases/Client/IBookingHistoryUseCase";

const { INTERNAL_SERVER_ERROR } = HttpStatusCode;
const { INTERNAL_ERROR } = Messages;

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

        } catch (error) {
            if (error.status && error.message) {
                throw error;
            }
            throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR };
        }
    }
}
