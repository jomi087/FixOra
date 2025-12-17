import { ChatMessageListItem } from "../../../../domain/entities/projections/ChatMessageListItem";
import { ChatMessageInputDTO } from "../../../dtos/ChatDTO";

export interface IGetChatMessagesUseCase {
    execute(input: ChatMessageInputDTO): Promise<{ data: ChatMessageListItem[]; total: number }>
}
