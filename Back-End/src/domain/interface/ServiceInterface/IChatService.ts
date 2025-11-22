export interface IChatService {
    /**
     * Send new message to all participants in the chat room
     * @param chatId 
     * @param message 
     */
    sendNewMessage(chatId: string, message: any): void

    /**
     * Notify latest Message in reciver Chat list
     * @param userId 
     * @param payload 
     */
    sendChatListUpdate(userId: string, payload: any):void

    //sendTyping(chatId: string, userId: string):void
    // sendMessageSeen(chatId: string, userId: string, messageId: string):void
}
