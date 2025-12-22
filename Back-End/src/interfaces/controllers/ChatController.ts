import { NextFunction, Request, Response } from "express";
import { HttpStatusCode } from "../../shared/enumss/HttpStatusCode";
import { Messages } from "../../shared/const/Messages";

import { IGetUserChatsUseCase } from "../../application/Interface/useCases/chat/IGetUserChatsUseCase";
import { IStartChatUseCase } from "../../application/Interface/useCases/chat/IStartChatUseCase";
import { IGetChatMessagesUseCase } from "../../application/Interface/useCases/chat/IGetChatMessagesUseCase";
import { ISendChatMessageUseCase } from "../../application/Interface/useCases/chat/ISendChatMessageUseCase";
import { IChatService } from "../../domain/interface/serviceInterface/IChatService";
import { CallStatus } from "../../shared/types/common";
import { ICallService } from "../../domain/interface/serviceInterface/ICallService";
import { ILogCallUseCase } from "../../application/Interface/useCases/chat/ILogCallUseCase";
import { AppError } from "../../shared/errors/AppError";

const { OK, UNAUTHORIZED } = HttpStatusCode;
const { UNAUTHORIZED_MSG } = Messages;


export class ChatController {
    constructor(
        private _startChatUseCase: IStartChatUseCase,
        private _getUserChatsUseCase: IGetUserChatsUseCase,
        private _getChatMessagesUseCase: IGetChatMessagesUseCase,
        private _sendChatMessageUseCase: ISendChatMessageUseCase,
        private _logCallUseCase: ILogCallUseCase,
        private _chatService: IChatService,
        private _callService: ICallService,
    ) { }

    async startChat(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            if (!req.user?.userId) {
                throw new AppError(UNAUTHORIZED, UNAUTHORIZED_MSG);
            }
            const userId = req.user.userId;
            const partnerId = req.body.userId as string;

            await this._startChatUseCase.execute({ userId, partnerId });

            res.status(OK).json({
                success: true,
            });

        } catch (error) {
            next(error);
        }
    }

    async getChatList(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user?.userId) {
                throw new AppError(UNAUTHORIZED, UNAUTHORIZED_MSG);
            }
            const search = req.query.searchQuery;

            const userId = req.user.userId;
            const chatList = await this._getUserChatsUseCase.execute({
                userId,
                ...(search && { search: String(search) })
            });

            res.status(OK).json({
                success: true,
                chatList
            });

        } catch (error) {
            next(error);
        }
    }

    async getChatMessages(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { chatId } = req.params;
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 30;

            const result = await this._getChatMessagesUseCase.execute({ chatId, page, limit });

            res.status(OK).json({
                success: true,
                result
            });

        } catch (err) {
            next(err);
        }
    }

    async sendChatMessage(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user?.userId) {
                throw new AppError(UNAUTHORIZED, UNAUTHORIZED_MSG);
            }
            const senderId = req.user.userId;

            const { chatId } = req.params;
            const type = req.body.type as "text" | "image";
            const content = req.body.content ?? "";

            const fileData = req.file
                ? {
                    buffer: req.file.buffer,
                    mimeType: req.file.mimetype,
                    size: req.file.size,
                }
                : null;

            const { chatMessage, receiverId } = await this._sendChatMessageUseCase.execute({
                chatId,
                senderId,
                type,
                content,
                file: fileData,
            });

            const responseDTO = {
                id: chatMessage.id!,
                chatId: chatMessage.chatId,
                senderId: chatMessage.senderId,
                content: chatMessage.content,
                type: chatMessage.type,
                ...(chatMessage.file && { file: chatMessage.file }),
                createdAt: chatMessage.createdAt!,
                isRead: chatMessage.isRead,
            };

            this._chatService.sendNewMessage(chatId, responseDTO);
            this._chatService.sendChatListUpdate(receiverId, responseDTO);

            res.status(OK).json({
                success: true,
            });

        } catch (err) {
            next(err);
        }
    }

    async logCall(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user?.userId) {
                throw new AppError(UNAUTHORIZED, UNAUTHORIZED_MSG);
            }
            const { chatId } = req.params;
            const { callerId, status }: { callerId: string; status: CallStatus } = req.body;
            // const receiverId = req.user.userId;

            const chatMessage = await this._logCallUseCase.execute({
                chatId,
                callerId,
                callStatus:status
            });

            const responseDTO = {
                id: chatMessage.id!,
                chatId: chatMessage.chatId,
                senderId: chatMessage.senderId,
                content: chatMessage.content,
                type: chatMessage.type,
                callStatus: chatMessage.callStatus,
                createdAt: chatMessage.createdAt!,
                isRead: chatMessage.isRead,
            };

            this._chatService.sendNewMessage(chatId, responseDTO);
            this._chatService.sendChatListUpdate(callerId, responseDTO);


            if (status == "accepted") {
                this._callService.sendCallAccepted(callerId, { roomID: chatId });
            } else if (status == "rejected") {
                this._callService.sendCallRejected(callerId, { reason: "Call Rejected" });
            }

            res.status(OK).json({
                success: true,
            });

        } catch (err) {
            next(err);
        }
    }

}