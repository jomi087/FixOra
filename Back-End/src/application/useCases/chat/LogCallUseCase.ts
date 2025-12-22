import { ChatMessage } from "../../../domain/entities/ChatMessageEntity";
import { IChatMessageRepository } from "../../../domain/interface/repositoryInterface/IChatMessageRepository";
import { IChatRepository } from "../../../domain/interface/repositoryInterface/IChatRepository";
import { LogCallInputDTO } from "../../dto/ChatDTO";
import { ILogCallUseCase } from "../../interface/useCases/chat/ILogCallUseCase";


export class LogCallUseCase implements ILogCallUseCase {
    constructor(
        private _chatRepository: IChatRepository,
        private _chatMessageRepository: IChatMessageRepository
    ) { }

    async execute(input: LogCallInputDTO): Promise<ChatMessage> {

        try {
            const { chatId, callerId, callStatus } = input;

            let content = "Vedio Call";

            if (callStatus == "rejected") {
                content = `${content} (No Answer)`;
            } // else for accepte it will be Vedio Call

            const chatMsg = await this._chatMessageRepository.createChatMessage({
                chatId,
                senderId:callerId,
                content,
                type: "call",
                callStatus:callStatus
            });

            await this._chatRepository.updateLatestMessage(chatId, chatMsg.id!);

            return chatMsg;

        } catch (error: unknown) {
            throw error;
        }
    }
}