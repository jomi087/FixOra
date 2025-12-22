import { IBookingRepository } from "../../../domain/interface/repositoryInterface/IBookingRepository";
import { JobHistoryInputDTO, JobHistoryOutputDTO } from "../../dtos/booking/BookingHistoryDTO";
import { IJobHistoryUseCase } from "../../interface/useCases/provider/IJobHistoryUseCase";



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

        } catch (error: unknown) {
            throw error;
        }
    }
}
