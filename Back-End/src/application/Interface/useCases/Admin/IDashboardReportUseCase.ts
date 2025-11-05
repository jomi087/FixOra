import { DashboardStatsOutputDTO, TimeRange } from "../../../DTOs/DashboardDTO";

export interface IDashboardReportUseCase {
  execute(range:TimeRange): Promise<DashboardStatsOutputDTO>;
}

