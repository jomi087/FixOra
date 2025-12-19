import { Schema, model, Document, Types } from "mongoose";
import { CallStatus } from "../../../shared/types/common";

export interface ChatMessageDocument extends Document {
    _id: Types.ObjectId;
    chatId: Types.ObjectId;
    senderId: string;
    content: string;
    type: "text" | "call" | "image";
    callStatus?: CallStatus;
    file?: {
        url: string;
        mimeType: string;
        size: number;
    };
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
            default: "",
            required: true,
        },
        type: {
            type: String,
            enum: ["text", "call", "image"],
            default: "text"
        },
        callStatus: {
            type: String,
            enum: ["accepted", "rejected"],
            required: false
        },
        file: {
            type: {
                url: { type: String },
                mimeType: { type: String },
                size: { type: Number },
            },
            default: undefined
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