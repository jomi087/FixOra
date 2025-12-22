import { DashboardStatsOutputDTO, TimeRange } from "../../../dto/DashboardDTO";

export interface IDashboardReportUseCase {
  execute(range:TimeRange): Promise<DashboardStatsOutputDTO>;
}

