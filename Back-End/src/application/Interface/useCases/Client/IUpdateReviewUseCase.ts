import { UpdateReviewInputDTO, UpdateReviewOutputDTO } from "../../../DTOs/ReviewDTO";

export interface IUpdateReviewUseCase  {
    execute(input: UpdateReviewInputDTO):Promise<UpdateReviewOutputDTO>
}
