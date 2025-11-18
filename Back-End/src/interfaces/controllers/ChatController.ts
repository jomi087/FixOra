import { NextFunction, Request, Response } from "express";
import { HttpStatusCode } from "../../shared/enums/HttpStatusCode";
import { Messages } from "../../shared/const/Messages";

import { IGetUserChatsUseCase } from "../../application/Interface/useCases/chat/GetUserChatsUseCase";
import { IStartChatUseCase } from "../../application/Interface/useCases/chat/IStartChatUseCase";
import { IGetChatMessagesUseCase } from "../../application/Interface/useCases/chat/GetChatMessagesUseCase ";

const { OK, UNAUTHORIZED } = HttpStatusCode;
const { UNAUTHORIZED_MSG } = Messages;


export class ChatController {
    constructor(
        private _startChatUseCase: IStartChatUseCase,
        private _getUserChatsUseCase: IGetUserChatsUseCase,
        private _getChatMessagesUseCase: IGetChatMessagesUseCase,

    ) { }


    async startChat(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            if (!req.user?.userId) {
                throw { status: UNAUTHORIZED, message: UNAUTHORIZED_MSG };
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
                throw { status: UNAUTHORIZED, message: UNAUTHORIZED_MSG };
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
            console.log("result", result);

            res.status(OK).json({
                success: true,
                result
            });

        } catch (err) {
            next(err);
        }
    }

}