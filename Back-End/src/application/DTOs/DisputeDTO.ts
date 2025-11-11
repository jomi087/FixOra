import { DisputeStatus, DisputeType } from "../../shared/enums/Dispute";
import { RoleEnum } from "../../shared/enums/Roles";
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
    reportedBy: {
        userId: string;
        name: string;
        email: string;
        role: RoleEnum;
    },
    reason: string;
    status: DisputeStatus;
    createdAt: Date;
}

export interface DisputeContentOutput {
    id: string;
    rating?: number;
    description: string;
    date: Date;
    user: {
        userId: string;
        name: string;
        email: string;
        role: string;
    };
};

export interface DisputeListResponseDTO extends PaginationOutputDTO<DisputeListItemDTO> { }

