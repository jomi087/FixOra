import { ChatListItem } from "../../../domain/entities/projections/ChatListItem";
import { IChatRepository } from "../../../domain/interface/RepositoryInterface/IChatRepository";
import { Messages } from "../../../shared/const/Messages";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { GetChatsInputDTO } from "../../DTOs/ChatDTO";
import { IGetUserChatsUseCase } from "../../Interface/useCases/chat/GetUserChatsUseCase";


const { INTERNAL_SERVER_ERROR } = HttpStatusCode;
const { INTERNAL_ERROR, } = Messages;

export class GetUserChatsUseCase implements IGetUserChatsUseCase {
    constructor(
        private _chatRepository: IChatRepository,
    ) { }

    async execute(input: GetChatsInputDTO): Promise<ChatListItem[]> {
        try {
            const { userId, search } = input;
            return await this._chatRepository.findUserChats(userId, search);

        } catch (error) {
            if (error.status && error.message) {
                throw error;
            }
            throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR };
        }
    }
}