import { AddReviewInputDTO } from "../../../dtos/ReviewDTO";

export interface IAddReviewUseCase  {
    execute(input: AddReviewInputDTO):Promise<void>
}
