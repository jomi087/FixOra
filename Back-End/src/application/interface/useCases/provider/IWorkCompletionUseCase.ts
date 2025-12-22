import { WorkCompletionInputDTO, WorkCompletionOutputDTO } from "../../../dto/WorkCompletionDTO";

export interface IWorkCompletionUseCase {
    execute(input : WorkCompletionInputDTO): Promise<WorkCompletionOutputDTO>
}