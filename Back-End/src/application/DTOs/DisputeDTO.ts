import { DisputeStatus, DisputeType } from "../../shared/enumss/Dispute";
import { RoleEnum } from "../../shared/enumss/Roles";
import { PaginationOutputDTO } from "./Common/PaginationDTO";

export interface DisputeInputDTO {
    userId: string;
    disputeType: DisputeType;
    contextId: string;  // disputype related id (like rating id or chat id) 
    reason: string;
};

export interface DisputeActionInputDTO {
    disputeId: string;
    userId: string;
    reason: string;
    status: DisputeStatus;
};

export interface FilterDisputeInputDTO {
    searchQuery: string;
    filterType: "" | DisputeType;
    filterStatus: "" | DisputeStatus;
    page: number;
    limit: number;
};

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
    adminNote?: {
        name: string;
        action: string;
    };
    createdAt: Date;

};

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

export interface DisputeListResponseDTO extends PaginationOutputDTO<DisputeListItemDTO> { };

export interface DisputeActionOutputDTO {
    status: string;
    adminNote: {
        name: string;
        action: string;
    };
}
