import { AddFeedbackInputDTO } from "../../../DTOs/ReviewDTO";

export interface IAddFeedbackUseCase  {
    execute(input: AddFeedbackInputDTO):Promise<void>
}
