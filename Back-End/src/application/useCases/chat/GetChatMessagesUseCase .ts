import { ChatMessageListItem } from "../../../domain/entities/projections/ChatMessageListItem";
import { IChatMessageRepository } from "../../../domain/interface/RepositoryInterface/IChatMessageRepository";
import { Messages } from "../../../shared/const/Messages";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { ChatMessageInputDTO } from "../../DTOs/ChatDTO";
import { IGetChatMessagesUseCase } from "../../Interface/useCases/chat/IGetChatMessagesUseCase";


const { INTERNAL_SERVER_ERROR } = HttpStatusCode;
const { INTERNAL_ERROR } = Messages;


export class GetChatMessagesUseCase implements IGetChatMessagesUseCase {
    constructor(
        private _chatMessageRepository: IChatMessageRepository
    ) { }

    async execute(input: ChatMessageInputDTO): Promise<{ data: ChatMessageListItem[]; total: number }> {
        try {
            const { chatId, page, limit } = input;
            return await this._chatMessageRepository.getMessagesByChatId(chatId, page, limit);
            
        } catch (error) {
            console.log("error",error);
            if (error.status && error.message) {
                throw error;
            }
            throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR };
        }
    }
}
