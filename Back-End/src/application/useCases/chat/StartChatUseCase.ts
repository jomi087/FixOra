import { IChatRepository } from "../../../domain/interface/RepositoryInterface/IChatRepository";
import { Messages } from "../../../shared/const/Messages";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { StartChatDTO  } from "../../DTOs/ChatDTO";
import { IStartChatUseCase } from "../../Interface/useCases/chat/IStartChatUseCase";


const { INTERNAL_SERVER_ERROR } = HttpStatusCode;
const { INTERNAL_ERROR, } = Messages;

export class StartChatUseCase implements IStartChatUseCase {
    constructor(
        private _chatRepository: IChatRepository,
    ) { }

    async execute(input: StartChatDTO ): Promise<void> {
        try {
            const { userId, partnerId } = input;

            //will add later -> logic to check if booking made or not  
            let chat = await this._chatRepository.findChatBetweenUsers([userId, partnerId]);

            if (!chat) {
                chat = await this._chatRepository.createChat([userId, partnerId]);
            }

        } catch (error) {
            if (error.status && error.message) {
                throw error;
            }
            throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR };
        }



    }
}