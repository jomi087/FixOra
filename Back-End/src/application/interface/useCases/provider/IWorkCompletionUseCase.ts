import { WorkCompletionInputDTO, WorkCompletionOutputDTO } from "../../../dtos/WorkCompletionDTO";

export interface IWorkCompletionUseCase {
    execute(input : WorkCompletionInputDTO): Promise<WorkCompletionOutputDTO>
}