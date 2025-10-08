import { IRatingRepository } from "../../../domain/interface/RepositoryInterface/IRaitingRepository";
import { HttpStatusCode } from "../../../shared/Enums/HttpStatusCode";
import { Messages } from "../../../shared/const/Messages";
import { IReviewStatusUseCase } from "../../Interface/useCases/Client/IReviewStatusUseCase";

const { INTERNAL_SERVER_ERROR } = HttpStatusCode;
const { INTERNAL_ERROR } = Messages;

export class ReviewStatusUseCase implements IReviewStatusUseCase {

    constructor(
        private readonly _ratingRepository: IRatingRepository,
        // private readonly _bookingRepository: IBookingRepository,
    ) { }
    async execute (bookingId: string): Promise<boolean> {
        try {
            const reviewData = await this._ratingRepository.findByBookingID(bookingId);
            if (reviewData) return true;
            return false;

        } catch (error: any) {
            if (error.status && error.message) {
                throw error;
            }
            throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR };
        }
    }
}