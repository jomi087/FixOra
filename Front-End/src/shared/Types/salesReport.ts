export type SalesPreset = "today" | "thisWeek" | "thisMonth"
interface SummaryCount {
  total: number;
  completed: number;
  cancelled: number;
  pendingWork: number;
}

export interface CompleteHistory {
  bookingId: string;
  serviceCharge: number;
  distanceFee: number;
  commission: number;
  Date: string;
}


export interface SalesSummary {
  totalCompletedSaleAmount: number;
  refundAmount: number;
  summaryCount: SummaryCount;
  completeHistory: CompleteHistory[];
}
