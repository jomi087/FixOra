import { JobHistoryInputDTO, JobHistoryOutputDTO } from "../../../DTOs/BookingDTO/BookingHistoryDTO";

export interface IJobHistoryUseCase {
  execute(input: JobHistoryInputDTO): Promise<JobHistoryOutputDTO>;
}
