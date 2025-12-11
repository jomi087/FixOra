import { CallStatus } from "../../shared/types/common";

export interface ChatMessage {
    id?: string
    chatId: string;
    senderId: string;
    content: string;
    type: "text" | "call";
    callStatus?: CallStatus;
    isRead: boolean;
    isActive: boolean;
    createdAt?: Date,
    updatedAt?: Date
}