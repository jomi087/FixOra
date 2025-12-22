import { Chat } from "../../entities/ChatEntity";
import { ChatListItem } from "../../entities/projections/ChatListItem";

export interface IChatRepository {

    /**
     * Retrieves all chats that belong to a specific user.
     * @param userId 
     * @param search 
     */
    findUserChats(userId: string, search?: string): Promise<ChatListItem[]>;

    /**
     * Finds an existing chat between a specific set of participants.
     * @param participants 
     */
    findChatBetweenUsers(participants: string[]): Promise<Chat | null>;

    /**
     * Creates a new chat with the given participants.
     * @param participants 
     */
    createChat(participants: string[]): Promise<Chat>;

    /**
     * Updates the chat's reference to its latest message.
     * @param chatId 
     * @param chatMessageId 
     */
    updateLatestMessage(chatId: string, chatMessageId: string): Promise<void>;

    /**
     * Find a chat by its ID.
     * @param chatId 
    */
    getChatById(chatId: string): Promise<Chat | null>
}
