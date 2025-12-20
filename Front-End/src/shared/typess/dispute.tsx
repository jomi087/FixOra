import type { DisputeStatus, DisputeType } from "../enums/Dispute";
import type { RoleEnum } from "../enums/roles";


export interface DisputeListPayload {
  searchQuery: string;
  filterType: "" | DisputeType;
  filterStatus: "" | DisputeStatus;
  page: number;
  limit: number;
}

export interface Dispute {
  disputeId: string;
  disputeType: DisputeType;
  reportedBy: {
    userId: string;
    name: string;
    email: string;
    role: RoleEnum;
    avatar?: string
  },
  reason: string;
  status: DisputeStatus;
  adminNote?: {
    name: string;
    action: string;
  };
  createdAt: string;
}

export interface DisputeContent {
  id: string;
  rating?: number;
  description: string;
  date: string;
  user: {
    userId: string
    name: string;
    email: string;
    role: RoleEnum;
    avatar?: string
  },
}

export interface DisputeContentResponse {
  success: boolean;
  contentData: DisputeContent
}

export interface DisputeListResponse {
  success: boolean;
  disputeData: Dispute[];
  total: number;
}


