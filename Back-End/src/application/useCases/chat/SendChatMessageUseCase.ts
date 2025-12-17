import { ChatMessage } from "../../../domain/entities/ChatMessageEntity";
import { IChatMessageRepository } from "../../../domain/interface/repositoryInterface/IChatMessageRepository";
import { IChatRepository } from "../../../domain/interface/repositoryInterface/IChatRepository";
import { Messages } from "../../../shared/const/Messages";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { AppError } from "../../../shared/errors/AppError";
import { SendChatMessageInputDTO } from "../../dtos/ChatDTO";
import { ISendChatMessageUseCase } from "../../Interface/useCases/chat/ISendChatMessageUseCase";


const { NOT_FOUND } = HttpStatusCode;
const { NOT_FOUND_MSG, } = Messages;

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
            if (!chat) throw new AppError(NOT_FOUND, NOT_FOUND_MSG("Chat"));


            const receiverId = chat.participants.find(id => id !== senderId);
            if (!receiverId) throw new AppError(NOT_FOUND, NOT_FOUND_MSG("Receiver"));


            return {
                chatMessage: chatMsg,
                receiverId
            };
        } catch (error: unknown) {
            throw error;
        }
    }
}
