import { CallStatus } from "../../shared/types/common";

export interface ChatMessage {
    id?: string
    chatId: string;
    senderId: string;
    content: string;
    type: "text" | "call" | "image";
    callStatus?: CallStatus;

    // For file-based messages (image, document, video later)
    file?: {
        url: string;
        mimeType: string;
        size: number;
    };

    isRead: boolean;
    isActive: boolean;
    createdAt?: Date,
    updatedAt?: Date
}