import { ReviewInputDTO, ReviewOutputDTO } from "../../../DTO's/ReviewDTO";

export interface IGetProviderReviewsUseCase {
    execute(input: ReviewInputDTO): Promise<ReviewOutputDTO>;
}