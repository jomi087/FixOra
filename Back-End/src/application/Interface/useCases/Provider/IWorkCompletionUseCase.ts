import { WorkCompletionInputDTO, WorkCompletionOutputDTO } from "../../../DTOs/WorkCompletionDTO";

export interface IWorkCompletionUseCase {
    execute(input : WorkCompletionInputDTO): Promise<WorkCompletionOutputDTO>
}