import { DashboardStatsOutputDTO, TimeRange } from "../../../dto/DashboardDTO";

export interface IDashboardReportUseCase {
  execute(params: {
    range: TimeRange;
    from: Date;
    to: Date;
  }): Promise<DashboardStatsOutputDTO>
}

