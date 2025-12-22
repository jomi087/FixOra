import { ChatMessage } from "../../../domain/entities/ChatMessageEntity";
import { IChatMessageRepository } from "../../../domain/interface/repositoryInterfaceTempName/IChatMessageRepository";
import { IChatRepository } from "../../../domain/interface/repositoryInterfaceTempName/IChatRepository";
import { IFileValidationService } from "../../../domain/interface/serviceInterfaceTempName/IFileValidationService";
import { IImageUploaderService } from "../../../domain/interface/serviceInterfaceTempName/IImageUploaderService";
import { Messages } from "../../../shared/const/Messages";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { AppError } from "../../../shared/errors/AppError";
import { SendChatMessageInputDTO } from "../../dtos/ChatDTO";
import { ISendChatMessageUseCase } from "../../Interface/useCases/chat/ISendChatMessageUseCase";


const { NOT_FOUND, BAD_REQUEST } = HttpStatusCode;
const { NOT_FOUND_MSG } = Messages;

export class SendChatMessageUseCase implements ISendChatMessageUseCase {
    constructor(
        private _chatRepository: IChatRepository,
        private _chatMessageRepository: IChatMessageRepository,
        private readonly _imageUploaderService: IImageUploaderService, //cloudinary
        private readonly _fileValidatonService: IFileValidationService
    ) { }

    async execute(input: SendChatMessageInputDTO): Promise<{
        chatMessage: ChatMessage,
        receiverId: string
    }> {
        try {
            const { chatId, senderId, type, content, file } = input;

            let normalizedContent = content?.trim() ?? "";

            if (type === "text" && !normalizedContent) {
                throw new AppError(BAD_REQUEST, "Text message cannot be empty");
            }

            if (type === "text" && file) {
                throw new AppError(BAD_REQUEST, "Text message cannot have attachment");
            }

            if (type === "image" && !file) {
                throw new AppError(BAD_REQUEST, "Image file is required");
            }

            if (type === "image" && !normalizedContent) {
                normalizedContent = "📷 Photo";
            }

            let imageUrl: string | null = null;

            if (file) {
                this._fileValidatonService.validate(file);
                imageUrl = await this._imageUploaderService.uploadImage(file.buffer, "FixOra/Chats");
            }

            const chatMsg = await this._chatMessageRepository.createChatMessage({
                chatId,
                senderId,
                content: normalizedContent,
                type,
                ...(file && imageUrl && {
                    file: {
                        url: imageUrl,
                        mimeType: file.mimeType,
                        size: file.size
                    }
                }),
            });



            await this._chatRepository.updateLatestMessage(input.chatId, chatMsg.id!);

            const chat = await this._chatRepository.getChatById(chatId);
            if (!chat) throw new AppError(NOT_FOUND, NOT_FOUND_MSG("Chat"));


            const receiverId = chat.participants.find(id => id !== senderId);
            if (!receiverId) throw new AppError(NOT_FOUND, NOT_FOUND_MSG("Receiver"));

            return {
                chatMessage: chatMsg,
                receiverId
            };

        } catch (error: unknown) {
            throw error;
        }
    }
}
