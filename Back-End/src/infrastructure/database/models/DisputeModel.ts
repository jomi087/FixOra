
import { Schema, model, Document } from "mongoose";
import { DisputeStatus } from "../../../shared/enumss/Dispute";
import { DisputeType } from "../../../shared/enumss/Dispute";

export interface DisputeDocument extends Document {
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

const DisputeSchema = new Schema<DisputeDocument>(
    {
        disputeId: {
            type: String,
            required: true,
            unique: true
        },
        disputeType: {
            type: String,
            enum: Object.values(DisputeType),
            required: true,
        },
        contentId: {
            type: String,
            required: true,
        },
        reportedBy: {
            type: String,
            required: true,
        },
        reason: {
            type: String,
            required: true,
            trim: true,
        },
        status: {
            type: String,
            enum: Object.values(DisputeStatus),
            default: DisputeStatus.PENDING,
            required: true,
        },
        adminNote: {
            adminId: { type: String },
            action: { type: String },
        },
        resolvedAt: { type: Date },
    },
    { timestamps: true }
);

export const DisputeModel = model<DisputeDocument>("Dispute", DisputeSchema);