import { AddFeedbackInputDTO } from "../../../DTO's/FeedbackDTO";

export interface IAddFeedbackUseCase  {
    execute(input: AddFeedbackInputDTO):Promise<void>
}
