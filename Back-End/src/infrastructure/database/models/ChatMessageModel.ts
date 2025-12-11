import { Schema, model, Document, Types } from "mongoose";
import { CallStatus } from "../../../shared/types/common";

export interface ChatMessageDocument extends Document {
    _id: Types.ObjectId;
    chatId: Types.ObjectId;
    senderId: string;
    content: string;
    type: "text" | "call";
    callStatus?: CallStatus;
    isRead: boolean;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const ChatMessageSchema = new Schema<ChatMessageDocument>(
    {
        chatId: {
            type: Schema.Types.ObjectId,
            ref: "Chat",
            required: true,
            index: true
        },
        senderId: {
            type: String, // user model id (not _id )
            required: true,
            index: true
        },
        content: {
            type: String,
            trim: true,
            required: true,
        },
        type: {
            type: String,
            enum: ["text", "call"],
            default: "text"
        },
        callStatus: {
            type: String,
            enum: ["accepted", "rejected"],
            required: false
        },
        isRead: {
            type: Boolean,
            default: false
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
);

export const ChatMessageModel = model<ChatMessageDocument>("ChatMessage", ChatMessageSchema);