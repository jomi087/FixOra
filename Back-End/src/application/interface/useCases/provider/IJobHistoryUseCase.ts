import { JobHistoryInputDTO, JobHistoryOutputDTO } from "../../../dtos/booking/BookingHistoryDTO";

export interface IJobHistoryUseCase {
  execute(input: JobHistoryInputDTO): Promise<JobHistoryOutputDTO>;
}
