import { IRatingRepository } from "../../../domain/interface/RepositoryInterface/IRaitingRepository";
import { Messages } from "../../../shared/const/Messages";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { updateFeedbackInputDTO, updateFeedbackOutputDTO } from "../../DTOs/ReviewDTO";
import { IUpdateFeedbackUseCase } from "../../Interface/useCases/Client/IUpdateFeedbackUseCase";


const { INTERNAL_SERVER_ERROR } = HttpStatusCode;
const { INTERNAL_ERROR } = Messages;

export class UpdateFeedbackUseCase implements IUpdateFeedbackUseCase {
    constructor(
        private readonly _ratingRepository: IRatingRepository,
    ) { }

    async execute(input: updateFeedbackInputDTO): Promise<updateFeedbackOutputDTO> {

        try {
            const { feedback, rating, ratingId } = input;
            const updateData: Record<string, string | number> = {};
            if (rating !== undefined) updateData.rating = rating;
            if (feedback !== undefined) updateData.feedback = feedback;

            const updatedData = await this._ratingRepository.updateRating(ratingId, updateData);
            if (!updatedData) throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR };

            const mappedData = {
                ratingId: updatedData.ratingId,
                rating: updatedData.rating,
                feedback: updatedData.feedback
            };
            return mappedData;
        } catch (error) {
            if (error.status && error.message) {
                throw error;
            }
            throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR };
        }
    }

}