import { ChatMessage } from "../../../../domain/entities/ChatMessageEntity";
import { LogCallInputDTO } from "../../../dtos/ChatDTO";

export interface ILogCallUseCase {
    execute(input: LogCallInputDTO): Promise<ChatMessage> 
}