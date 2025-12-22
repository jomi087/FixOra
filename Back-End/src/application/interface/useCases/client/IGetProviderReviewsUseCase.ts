import { ReviewInputDTO, ReviewOutputDTO } from "../../../dto/ReviewDTO";

export interface IGetProviderReviewsUseCase {
    execute(input: ReviewInputDTO): Promise<ReviewOutputDTO>;
}