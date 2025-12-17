import { ChatMessage } from "../../../domain/entities/ChatMessageEntity";
import { IChatMessageRepository } from "../../../domain/interface/repositoryInterface/IChatMessageRepository";
import { IChatRepository } from "../../../domain/interface/repositoryInterface/IChatRepository";
import { LogCallInputDTO } from "../../dtos/ChatDTO";
import { ILogCallUseCase } from "../../Interface/useCases/chat/ILogCallUseCase";


export class LogCallUseCase implements ILogCallUseCase {
    constructor(
        private _chatRepository: IChatRepository,
        private _chatMessageRepository: IChatMessageRepository
    ) { }

    async execute(input: LogCallInputDTO): Promise<ChatMessage> {

        try {
            const { chatId, callerId, status } = input;

            let content = "Vedio Call";

            if (status == "rejected") {
                content = `${content} (No Answer)`;
            } // else for accepte it will be Vedio Call

            const chatMsg = await this._chatMessageRepository.createChatMessage(
                chatId,
                callerId,
                content,
                "call",
                status
            );

            await this._chatRepository.updateLatestMessage(chatId, chatMsg.id!);

            return chatMsg;

        } catch (error: unknown) {
            throw error;
        }
    }
}