import type { DisputeStatus, DisputeType } from "../enums/Dispute";

export interface Dispute {
    disputeId: string;
    disputeType: DisputeType;
    reportedBy: string;
    reason: string;
    status: DisputeStatus;
    createdAt: string;
}


export interface DisputeListPayload {
  searchQuery: string;
  filterType: "" | DisputeType;
  filterStatus: "" | DisputeStatus;
  page: number;
  limit: number;
}

export interface DisputeListResponse {
  disputeData: Dispute[];
  total: number;
}
