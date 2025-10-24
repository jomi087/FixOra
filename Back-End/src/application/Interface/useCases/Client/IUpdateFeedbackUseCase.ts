import { updateFeedbackInputDTO } from "../../../DTOs/FeedbackDTO";

export interface IUpdateFeedbackUseCase  {
    execute(input: updateFeedbackInputDTO):Promise<void>
}
