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
