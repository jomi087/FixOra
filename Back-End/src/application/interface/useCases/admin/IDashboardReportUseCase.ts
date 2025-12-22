import { DashboardStatsOutputDTO, TimeRange } from "../../../dtos/DashboardDTO";

export interface IDashboardReportUseCase {
  execute(range:TimeRange): Promise<DashboardStatsOutputDTO>;
}

