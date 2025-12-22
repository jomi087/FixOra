import { ChatMessageListItem } from "../../../domain/entities/projections/ChatMessageListItem";
import { IChatMessageRepository } from "../../../domain/interface/repositoryInterface/IChatMessageRepository";
import { ChatMessageInputDTO } from "../../dtos/ChatDTO";
import { IGetChatMessagesUseCase } from "../../interfacetemp/useCases/chat/IGetChatMessagesUseCase";


export class GetChatMessagesUseCase implements IGetChatMessagesUseCase {
    constructor(
        private _chatMessageRepository: IChatMessageRepository
    ) { }

    async execute(input: ChatMessageInputDTO): Promise<{ data: ChatMessageListItem[]; total: number }> {
        try {
            const { chatId, page, limit } = input;
            return await this._chatMessageRepository.getMessagesByChatId(chatId, page, limit);
            
        } catch (error: unknown) {
            throw error;
        }
    }
}
