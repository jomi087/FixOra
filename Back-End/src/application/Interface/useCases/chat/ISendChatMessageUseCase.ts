import { ChatMessage } from "../../../../domain/entities/ChatMessageEntity";
import { SendChatMessageInputDTO } from "../../../DTOs/ChatDTO";

export interface ISendChatMessageUseCase {
    execute(input: SendChatMessageInputDTO): Promise<{
        chatMessage: ChatMessage,
        receiverId: string
    }>
}