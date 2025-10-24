import { updateFeedbackInputDTO, updateFeedbackOutputDTO } from "../../../DTOs/ReviewDTO";

export interface IUpdateFeedbackUseCase  {
    execute(input: updateFeedbackInputDTO):Promise<updateFeedbackOutputDTO>
}
