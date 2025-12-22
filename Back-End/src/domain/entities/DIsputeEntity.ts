import { DisputeStatus, DisputeType } from "../../shared/enums/Dispute";

export interface Dispute {
    disputeId: string;
    disputeType: DisputeType;
    contentId: string;
    reportedBy: string;
    reason: string;
    status: DisputeStatus;
    adminNote?: {
        adminId: string;
        action: string;
    };
    resolvedAt?: Date;
    createdAt: Date;
    updatedAt?: Date;
}