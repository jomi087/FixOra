export interface ChatMessage {
    id?:string
    chatId: string;
    senderId: string;
    content: string;
    isRead: boolean;
    isActive: boolean;
    createdAt?: Date,
    updatedAt?: Date
}