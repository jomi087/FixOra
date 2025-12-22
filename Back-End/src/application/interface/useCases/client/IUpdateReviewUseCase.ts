import { UpdateReviewInputDTO, UpdateReviewOutputDTO } from "../../../dto/ReviewDTO";

export interface IUpdateReviewUseCase  {
    execute(input: UpdateReviewInputDTO):Promise<UpdateReviewOutputDTO>
}
