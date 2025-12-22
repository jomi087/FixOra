export interface IChatService {
    /**
     * Send new message to all participants in the chat room
     * @param chatId 
     * @param message 
     */
    sendNewMessage(chatId: string, message: Record<string,unknown>): void

    /**
     * Notify latest Message in reciver Chat list
     * @param userId 
     * @param payload 
     */
    sendChatListUpdate(userId: string, payload: Record<string,unknown>):void

    //sendTyping(chatId: string, userId: string):void
    // sendMessageSeen(chatId: string, userId: string, messageId: string):void
}
