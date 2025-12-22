import { ReviewInputDTO, ReviewOutputDTO } from "../../../dtos/ReviewDTO";

export interface IGetProviderReviewsUseCase {
    execute(input: ReviewInputDTO): Promise<ReviewOutputDTO>;
}