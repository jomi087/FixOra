import { JobHistoryInputDTO, JobHistoryOutputDTO } from "../../../DTO's/BookingDTO/BookingHistoryDTO";

export interface IJobHistoryUseCase {
  execute(input: JobHistoryInputDTO): Promise<JobHistoryOutputDTO>;
}
