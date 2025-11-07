import { AddReviewInputDTO } from "../../../DTOs/ReviewDTO";

export interface IAddReviewUseCase  {
    execute(input: AddReviewInputDTO):Promise<void>
}
