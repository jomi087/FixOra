import { ReviewInputDTO, ReviewOutputDTO } from "../../../DTOs/ReviewDTO";

export interface IGetProviderReviewsUseCase {
    execute(input: ReviewInputDTO): Promise<ReviewOutputDTO>;
}