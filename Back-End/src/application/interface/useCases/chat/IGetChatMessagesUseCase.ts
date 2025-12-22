import { ChatMessageListItem } from "../../../../domain/entities/projections/ChatMessageListItem";
import { ChatMessageInputDTO } from "../../../dto/ChatDTO";

export interface IGetChatMessagesUseCase {
    execute(input: ChatMessageInputDTO): Promise<{ data: ChatMessageListItem[]; total: number }>
}
