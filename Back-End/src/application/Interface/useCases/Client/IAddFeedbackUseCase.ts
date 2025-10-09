import { AddFeedbackInputDTO } from "../../../DTOs/FeedbackDTO";

export interface IAddFeedbackUseCase  {
    execute(input: AddFeedbackInputDTO):Promise<void>
}
