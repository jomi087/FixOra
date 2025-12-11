import { ChatMessage } from "../../../domain/entities/ChatMessageEntity";
import { IChatMessageRepository } from "../../../domain/interface/RepositoryInterface/IChatMessageRepository";
import { IChatRepository } from "../../../domain/interface/RepositoryInterface/IChatRepository";
import { Messages } from "../../../shared/const/Messages";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { LogCallInputDTO } from "../../DTOs/ChatDTO";
import { ILogCallUseCase } from "../../Interface/useCases/chat/ILogCallUseCase";

const { INTERNAL_SERVER_ERROR } = HttpStatusCode;
const { INTERNAL_ERROR, } = Messages;

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

        } catch (error) {
            if (error.status && error.message) {
                throw error;
            }
            throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR };
        }
    }
}