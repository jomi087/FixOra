import { IChatService } from "../../domain/interface/ServiceInterface/IChatService";
import { getIO } from "../socket/config";

export class ChatService implements IChatService {

    /** @inheritdoc */
    sendNewMessage(chatId: string, message: any): void {
        getIO().to(chatId).emit("chat:newMessage", message);
    }

    /** @inheritdoc */
    sendChatListUpdate(userId: string, payload: any) {
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
