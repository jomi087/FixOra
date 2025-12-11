import { ChatMessage } from "../../../domain/entities/ChatMessageEntity";
import { IChatMessageRepository } from "../../../domain/interface/RepositoryInterface/IChatMessageRepository";
import { IChatRepository } from "../../../domain/interface/RepositoryInterface/IChatRepository";
import { Messages } from "../../../shared/const/Messages";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { SendChatMessageInputDTO } from "../../DTOs/ChatDTO";
import { ISendChatMessageUseCase } from "../../Interface/useCases/chat/ISendChatMessageUseCase";


const { INTERNAL_SERVER_ERROR, NOT_FOUND } = HttpStatusCode;
const { INTERNAL_ERROR, } = Messages;

export class SendChatMessageUseCase implements ISendChatMessageUseCase {
    constructor(
        private _chatRepository: IChatRepository,
        private _chatMessageRepository: IChatMessageRepository
    ) { }

    async execute(input: SendChatMessageInputDTO): Promise<{
        chatMessage: ChatMessage,
        receiverId: string
    }> {
        try {
            const { chatId, senderId, content } = input;

            const chatMsg = await this._chatMessageRepository.createChatMessage(
                chatId,
                senderId,
                content,
                "text"
            );

            await this._chatRepository.updateLatestMessage(input.chatId, chatMsg.id!);

            const chat = await this._chatRepository.getChatById(chatId);
            if (!chat) throw { status: NOT_FOUND, message: "Chat not found" };

            const receiverId = chat.participants.find(id => id !== senderId);
            if (!receiverId) throw { status: NOT_FOUND, message: "Receiver not found" };

            return {
                chatMessage: chatMsg,  
                receiverId
            };
        } catch (error) {
            if (error.status && error.message) {
                throw error;
            }
            throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR };
        }
    }
}
