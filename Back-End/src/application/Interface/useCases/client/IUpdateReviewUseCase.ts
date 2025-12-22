import { UpdateReviewInputDTO, UpdateReviewOutputDTO } from "../../../dtos/ReviewDTO";

export interface IUpdateReviewUseCase  {
    execute(input: UpdateReviewInputDTO):Promise<UpdateReviewOutputDTO>
}
