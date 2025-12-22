import { ChatMessage } from "../../../../domain/entities/ChatMessageEntity";
import { SendChatMessageInputDTO } from "../../../dto/ChatDTO";

export interface ISendChatMessageUseCase {
    execute(input: SendChatMessageInputDTO): Promise<{
        chatMessage: ChatMessage,
        receiverId: string
    }>
}