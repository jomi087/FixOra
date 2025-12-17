import { IChatService } from "../../domain/interface/serviceInterface/IChatService";
import { getIO } from "../socket/config";

export class ChatService implements IChatService {

    /** @inheritdoc */
    sendNewMessage(chatId: string, message: Record<string,unknown>): void {
        getIO().to(chatId).emit("chat:newMessage", message);
    }

    /** @inheritdoc */
    sendChatListUpdate(userId: string, payload: Record<string,unknown>) {
        getIO().to(userId).emit("chat:list:update", payload);
    }

    /** @inheritdoc */
    // sendTyping(chatId: string, userId: string): void {
    //     getIO().to(chatId).emit("chat:typing", { userId });
    // }

    // sendMessageSeen(chatId: string, userId: string, messageId: string) {
    //     getIO().to(chatId).emit("chat:seen", { userId, messageId });
    // }
}
