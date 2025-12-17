import { StartChatDTO } from "../../../dtos/ChatDTO";

export interface IStartChatUseCase {
    execute(input: StartChatDTO): Promise<void>
}