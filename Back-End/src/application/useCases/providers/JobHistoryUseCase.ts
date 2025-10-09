import { IBookingRepository } from "../../../domain/interface/RepositoryInterface/IBookingRepository";
import { HttpStatusCode } from "../../../shared/Enums/HttpStatusCode";
import { Messages } from "../../../shared/const/Messages";
import { JobHistoryInputDTO, JobHistoryOutputDTO } from "../../DTO's/BookingDTO/BookingHistoryDTO";
import { IJobHistoryUseCase } from "../../Interface/useCases/Provider/IJobHistoryUseCase";

const { INTERNAL_SERVER_ERROR } = HttpStatusCode;
const { INTERNAL_ERROR } = Messages;

export class JobHistoryUseCase implements IJobHistoryUseCase {
    constructor(
        private readonly _bookingRepository: IBookingRepository,
    ) { }

    async execute(input: JobHistoryInputDTO): Promise<JobHistoryOutputDTO> {
        try {
            const { providerUserId, currentPage, limit } = input;

            const bookings = await this._bookingRepository.findProviderJobHistoryById(
                providerUserId,
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
