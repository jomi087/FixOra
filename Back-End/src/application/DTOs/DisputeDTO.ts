import { DisputeType } from "../../shared/enums/Dispute";

export interface DisputeInputDTO{
    userId: string;
    disputeType: DisputeType;
    contextId: string;  // disputype related id (like rating id or chat id) 
    reason: string;
}