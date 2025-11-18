import { Schema, model, Document, Types } from "mongoose";

export interface ChatMessageDocument extends Document {
    _id: Types.ObjectId;
    chatId: Types.ObjectId;
    senderId: string;
    content: string;
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