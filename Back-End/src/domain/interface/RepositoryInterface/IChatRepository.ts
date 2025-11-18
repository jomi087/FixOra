import { Chat } from "../../entities/ChatEntity";
import { ChatListItem } from "../../entities/projections/ChatListItem";

export interface IChatRepository {
    findUserChats(userId: string, search?: string): Promise<ChatListItem[]>;
    findChatBetweenUsers(participants: string[]): Promise<Chat | null>;
    createChat(participants: string[]): Promise<Chat>;
}
