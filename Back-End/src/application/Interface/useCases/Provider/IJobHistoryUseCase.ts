import { JobHistoryInputDTO, JobHistoryOutputDTO } from "../../../dtos/BookingDTO/BookingHistoryDTO";

export interface IJobHistoryUseCase {
  execute(input: JobHistoryInputDTO): Promise<JobHistoryOutputDTO>;
}
