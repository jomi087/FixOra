import { CallStatus } from "../../../shared/types/common";
import { ChatMessage } from "../../entities/ChatMessageEntity";
import { ChatMessageListItem } from "../../entities/projections/ChatMessageListItem";

export interface IChatMessageRepository {
    /**
     * Retrieves paginated messages belonging to a specific chat.
     * @param chatId 
     * @param page 
     * @param limit 
     */
    getMessagesByChatId(chatId: string, page: number, limit: number): Promise<{
        data: ChatMessageListItem[]; total: number
    }>;

    /**
     * Creates a new message within a chat.
     * @param chatId 
     * @param senderId 
     * @param content 
     * @param type 
     * @param CallStatus (only for call)
     */
    createChatMessage(
        chatId: string,
        senderId: string,
        content: string,
        type: "text" | "call",
        status?: CallStatus,
    ): Promise<ChatMessage>
}

