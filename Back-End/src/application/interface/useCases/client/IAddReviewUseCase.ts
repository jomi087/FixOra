import { AddReviewInputDTO } from "../../../dto/ReviewDTO";

export interface IAddReviewUseCase  {
    execute(input: AddReviewInputDTO):Promise<void>
}
