import { DisputeStatus, DisputeType } from "../../shared/enums/Dispute";
import { PaginationOutputDTO } from "./Common/PaginationDTO";

export interface DisputeInputDTO {
    userId: string;
    disputeType: DisputeType;
    contextId: string;  // disputype related id (like rating id or chat id) 
    reason: string;
}

export interface FilterDisputeInputDTO {
    searchQuery: string;
    filterType: "" | DisputeType;
    filterStatus: "" | DisputeStatus;
    page: number;
    limit: number;
}

export interface DisputeListItemDTO {
    disputeId: string;
    disputeType: DisputeType;
    reportedBy: string;
    reason: string;
    status: DisputeStatus;
    createdAt: Date;
}


export interface DisputeListResponseDTO extends PaginationOutputDTO<DisputeListItemDTO> { }
