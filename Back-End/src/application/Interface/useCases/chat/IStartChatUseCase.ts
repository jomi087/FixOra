import { StartChatDTO } from "../../../DTOs/ChatDTO";

export interface IStartChatUseCase {
    execute(input: StartChatDTO): Promise<void>
}