import { SalesPreset } from "../../shared/types/salesReport";

export interface SalesReportInputDTO {
  providerUserId: string;
  preset?: SalesPreset;
  startDate?: string;
  endDate?: string;
}

interface SummaryCount {

  total: number;
  completed: number;
  cancelled: number;
  pendingWork: number;
}

interface CompleteHistory {
  bookingId: string;
  serviceCharge: number;
  distanceFee: number;
  commission: number;
  Date: Date | string; // "N/A" or a Date
}


export interface SalesReportOutputDTO {
  totalCompletedSaleAmount: number;
  refundAmount: number;
  summaryCount: SummaryCount;
  completeHistory: CompleteHistory[];
}