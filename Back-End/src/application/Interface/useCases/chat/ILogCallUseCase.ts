import { ChatMessage } from "../../../../domain/entities/ChatMessageEntity";
import { LogCallInputDTO } from "../../../DTOs/ChatDTO";

export interface ILogCallUseCase {
    execute(input: LogCallInputDTO): Promise<ChatMessage> 
}