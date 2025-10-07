import { WorkCompletionInputDTO, WorkCompletionOutputDTO } from "../../../DTO's/WorkCompletionDTO";

export interface IWorkCompletionUseCase {
    execute(input : WorkCompletionInputDTO): Promise<WorkCompletionOutputDTO>
}