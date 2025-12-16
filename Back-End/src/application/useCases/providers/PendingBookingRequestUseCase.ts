import { IBookingRepository } from "../../../domain/interface/RepositoryInterface/IBookingRepository";
import { PendingBookingRequestOutputDTO } from "../../DTOs/BookingDTO/PendingBookingRequestDTO";
import { IPendingBookingRequestUseCase } from "../../Interface/useCases/Provider/IPendingBookingRequestUseCase";



export class PendingBookingRequestUseCase implements IPendingBookingRequestUseCase {
    constructor(
        private readonly _bookingRepository: IBookingRepository,
    ) { }

    async execute(providerUserId: string): Promise<PendingBookingRequestOutputDTO[]> {
        try {

            const bookingDataInDetails = await this._bookingRepository.findProviderPendingBookingRequestInDetails(providerUserId,);

            const mappedData: PendingBookingRequestOutputDTO[] = bookingDataInDetails.map(({ userInfo, bookingInfo, subCategoryInfo }) => ({
                bookingId: bookingInfo.bookingId,
                userName: `${userInfo.fname} ${userInfo.lname}`,
                issueType: `${subCategoryInfo.name}`,
                scheduledAt: bookingInfo.scheduledAt,
                issue: bookingInfo.issue
            }));

            return mappedData;

        } catch (error: unknown) {
            throw error;
        }
    }
}
