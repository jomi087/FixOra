import { ChatMessageListItem } from "../../entities/projections/ChatMessageListItem";

export interface IChatMessageRepository {
    getMessagesByChatId(
        chatId: string,
        page: number,
        limit: number
    ): Promise<{ data: ChatMessageListItem[]; total: number }>;
}

