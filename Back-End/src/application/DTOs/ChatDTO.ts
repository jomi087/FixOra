export interface StartChatDTO {
    userId: string;
    partnerId: string;
}

export interface GetChatsInputDTO {
    userId: string;
    search?: string;
}


export interface ChatMessageInputDTO {
    chatId: string,
    page: number,
    limit: number
}


export interface SendChatMessageInputDTO {
    chatId: string,
    senderId: string,
    content: string,
}

export interface SendChatMessageOutputDTO {
    id: string;
    chatId: string;
    senderId: string;
    content: string;
    createdAt: Date;
    isRead: boolean;
}