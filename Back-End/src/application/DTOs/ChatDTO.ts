import { CallStatus } from "../../shared/types/common";

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

export interface LogCallInputDTO {
    chatId: string;
    callerId: string;
    status: CallStatus;
}