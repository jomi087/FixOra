import { ChatMessage } from "../../../../domain/entities/ChatMessageEntity";
import { LogCallInputDTO } from "../../../dto/ChatDTO";

export interface ILogCallUseCase {
    execute(input: LogCallInputDTO): Promise<ChatMessage> 
}