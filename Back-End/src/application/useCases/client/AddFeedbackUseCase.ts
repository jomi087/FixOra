import { IBookingRepository } from "../../../domain/interface/RepositoryInterface/IBookingRepository";
import { IRatingRepository } from "../../../domain/interface/RepositoryInterface/IRaitingRepository";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { Messages } from "../../../shared/const/Messages";
import { AddFeedbackInputDTO } from "../../DTOs/FeedbackDTO";
import { IAddFeedbackUseCase } from "../../Interface/useCases/Client/IAddFeedbackUseCase";

const { INTERNAL_SERVER_ERROR, CONFLICT, NOT_FOUND } = HttpStatusCode;
const { INTERNAL_ERROR, BOOKING_ID_NOT_FOUND } = Messages;

export class AddFeedbackUseCase implements IAddFeedbackUseCase {
    constructor(
        private readonly _ratingRepository: IRatingRepository,
        private readonly _bookingRepository: IBookingRepository,
    ) { }

    async execute(input: AddFeedbackInputDTO): Promise<void> {
        try {

            const { bookingId, rating, feedback } = input;

            const isReviewed = await this._ratingRepository.findByBookingID(bookingId);
            if (isReviewed) throw { status: CONFLICT, message: "Rating already exists for this booking." };

            const bookingData = await this._bookingRepository.findByBookingId(bookingId);
            if (!bookingData) throw { status: NOT_FOUND, message: BOOKING_ID_NOT_FOUND };

            await this._ratingRepository.create({
                bookingId,
                providerId : bookingData.provider.id,
                userId : bookingData.userId,
                rating,
                feedback,
                createdAt: new Date()
            });

        } catch (error) {
            if (error.status && error.message) {
                throw error;
            }
            throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR };
        }
    }
}