import { ChatMessageListItem } from "../../../../domain/entities/projections/ChatMessageListItem";
import { ChatMessageInputDTO } from "../../../DTOs/ChatDTO";

export interface IGetChatMessagesUseCase {
    execute(input: ChatMessageInputDTO): Promise<{ data: ChatMessageListItem[]; total: number }>
}
