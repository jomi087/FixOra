import { JobHistoryInputDTO, JobHistoryOutputDTO } from "../../../dto/booking/BookingHistoryDTO";

export interface IJobHistoryUseCase {
  execute(input: JobHistoryInputDTO): Promise<JobHistoryOutputDTO>;
}
