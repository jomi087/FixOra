import { IRatingRepository } from "../../../domain/interface/RepositoryInterface/IRaitingRepository";
import { IReviewStatusUseCase } from "../../Interface/useCases/Client/IReviewStatusUseCase";


export class ReviewStatusUseCase implements IReviewStatusUseCase {

    constructor(
        private readonly _ratingRepository: IRatingRepository,
        // private readonly _bookingRepository: IBookingRepository,
    ) { }
    async execute(bookingId: string): Promise<boolean> {
        try {
            const reviewData = await this._ratingRepository.findByBookingID(bookingId);
            if (reviewData) return true;
            return false;

        } catch (error: unknown) {
            throw error;
        }
    }
}