import { StartChatDTO } from "../../../dto/ChatDTO";

export interface IStartChatUseCase {
    execute(input: StartChatDTO): Promise<void>
}