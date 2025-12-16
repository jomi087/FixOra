import { IRatingRepository } from "../../../domain/interface/RepositoryInterface/IRaitingRepository";
import { Messages } from "../../../shared/const/Messages";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { AppError } from "../../../shared/errors/AppError";
import { UpdateReviewInputDTO, UpdateReviewOutputDTO } from "../../DTOs/ReviewDTO";
import { IUpdateReviewUseCase } from "../../Interface/useCases/Client/IUpdateReviewUseCase";


const { NOT_FOUND } = HttpStatusCode;
const { NOT_FOUND_MSG } = Messages;

export class UpdateReviewUseCase implements IUpdateReviewUseCase {
    constructor(
        private readonly _ratingRepository: IRatingRepository,
    ) { }

    async execute(input: UpdateReviewInputDTO): Promise<UpdateReviewOutputDTO> {

        try {
            const { feedback, rating, ratingId } = input;
            const updateData: Record<string, string | number> = {};
            if (rating !== undefined) updateData.rating = rating;
            if (feedback !== undefined) updateData.feedback = feedback;

            const updatedData = await this._ratingRepository.updateRating(ratingId, updateData);
            if (!updatedData) throw new AppError(NOT_FOUND, NOT_FOUND_MSG("Review"));


            const mappedData = {
                ratingId: updatedData.ratingId,
                rating: updatedData.rating,
                feedback: updatedData.feedback
            };
            return mappedData;
        } catch (error: unknown) {
            throw error;
        }
    }

}