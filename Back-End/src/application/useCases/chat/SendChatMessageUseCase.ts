import { IChatMessageRepository } from "../../../domain/interface/RepositoryInterface/IChatMessageRepository";
import { IChatRepository } from "../../../domain/interface/RepositoryInterface/IChatRepository";
import { Messages } from "../../../shared/const/Messages";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { SendChatMessageInputDTO, SendChatMessageOutputDTO } from "../../DTOs/ChatDTO";
import { ISendChatMessageUseCase } from "../../Interface/useCases/chat/ISendChatMessageUseCase";


const { INTERNAL_SERVER_ERROR, NOT_FOUND } = HttpStatusCode;
const { INTERNAL_ERROR, } = Messages;

export class SendChatMessageUseCase implements ISendChatMessageUseCase {
    constructor(
        private chatRepository: IChatRepository,
        private chatMessageRepository: IChatMessageRepository
    ) { }

    async execute(input: SendChatMessageInputDTO): Promise<{
        chatMessage: SendChatMessageOutputDTO,
        receiverId: string
    }> {
        try {
            const { chatId, senderId, content } = input;

            const chatMsg = await this.chatMessageRepository.createChatMessage(
                chatId,
                senderId,
                content
            );

            await this.chatRepository.updateLatestMessage(input.chatId, chatMsg.id!);

            const chat = await this.chatRepository.getChatById(chatId);
            if (!chat) throw { status: NOT_FOUND, message: "Chat not found" };

            const receiverId = chat.participants.find(id => id !== senderId);
            if (!receiverId) throw { status: NOT_FOUND, message: "Receiver not found" };

            return {
                chatMessage: {
                    id: chatMsg.id!,
                    chatId: chatMsg.chatId,
                    senderId: chatMsg.senderId,
                    content: chatMsg.content,
                    createdAt: chatMsg.createdAt!,
                    isRead: chatMsg.isRead
                },
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
