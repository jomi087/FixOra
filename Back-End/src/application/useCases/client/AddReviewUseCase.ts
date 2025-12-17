import { IBookingRepository } from "../../../domain/interface/RepositoryInterface/IBookingRepository";
import { IRatingRepository } from "../../../domain/interface/RepositoryInterface/IRaitingRepository";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { Messages } from "../../../shared/const/Messages";
import { AddReviewInputDTO } from "../../dtos/ReviewDTO";
import { IAddReviewUseCase } from "../../Interface/useCases/Client/IAddReviewUseCase";
import { v4 as uuidv4 } from "uuid";
import { AppError } from "../../../shared/errors/AppError";


const { CONFLICT, NOT_FOUND } = HttpStatusCode;
const { NOT_FOUND_MSG, ALREADY_EXISTS_MSG } = Messages;

export class AddReviewUseCase implements IAddReviewUseCase {
    constructor(
        private readonly _ratingRepository: IRatingRepository,
        private readonly _bookingRepository: IBookingRepository,
    ) { }

    async execute(input: AddReviewInputDTO): Promise<void> {
        try {

            const { bookingId, rating, feedback } = input;

            const isReviewed = await this._ratingRepository.findByBookingID(bookingId);
            if (isReviewed) throw new AppError(CONFLICT, ALREADY_EXISTS_MSG("A review for this booking"));

            const bookingData = await this._bookingRepository.findByBookingId(bookingId);
            if (!bookingData) throw new AppError(NOT_FOUND, NOT_FOUND_MSG("Booking"));

            await this._ratingRepository.create({
                ratingId: uuidv4(),
                bookingId,
                providerId: bookingData.provider.id,
                userId: bookingData.userId,
                rating,
                feedback,
                active: true,
                createdAt: new Date()
            });

        } catch (error: unknown) {
            throw error;
        }
    }
}