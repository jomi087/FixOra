import { SendChatMessageInputDTO, SendChatMessageOutputDTO } from "../../../DTOs/ChatDTO";

export interface ISendChatMessageUseCase {
    execute(input: SendChatMessageInputDTO): Promise<{
        chatMessage: SendChatMessageOutputDTO,
        receiverId: string
    }>
}