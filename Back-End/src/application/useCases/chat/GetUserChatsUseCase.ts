import { ChatListItem } from "../../../domain/entities/projections/ChatListItem";
import { IChatRepository } from "../../../domain/interface/repositoryInterfaceTempName/IChatRepository";
import { GetChatsInputDTO } from "../../dtos/ChatDTO";
import { IGetUserChatsUseCase } from "../../Interface/useCases/chat/IGetUserChatsUseCase";

export class GetUserChatsUseCase implements IGetUserChatsUseCase {
    constructor(
        private _chatRepository: IChatRepository,
    ) { }

    async execute(input: GetChatsInputDTO): Promise<ChatListItem[]> {
        try {
            const { userId, search } = input;
            return await this._chatRepository.findUserChats(userId, search);

        } catch (error: unknown) {
            throw error;
        }
    }
}