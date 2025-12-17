import mongoose from "mongoose";
import { ChatMessageListItem } from "../../../domain/entities/projections/ChatMessageListItem";
import { IChatMessageRepository } from "../../../domain/interface/repositoryInterface/IChatMessageRepository";
import { ChatMessageModel } from "../models/ChatMessageModel";
import { ChatMessage } from "../../../domain/entities/ChatMessageEntity";
import { CallStatus } from "../../../shared/types/common";

export class ChatMessageRepository implements IChatMessageRepository {

    /** @inheritdoc */
    async getMessagesByChatId(
        chatId: string,
        page: number,
        limit: number
    ): Promise<{ data: ChatMessageListItem[]; total: number; }> {

        const skip = (page - 1) * limit;

        const [messages, total] = await Promise.all([
            ChatMessageModel.aggregate([
                { $match: { chatId: new mongoose.Types.ObjectId(chatId) } },
                { $sort: { createdAt: -1 } }, // latest message first  ie, [{jomi am i}, {hlo}]  this is for pagination stability. 
                { $skip: skip },
                { $limit: limit },
                {
                    $project: {
                        _id: 0,
                        id: { $toString: "$_id" },
                        chatId: { $toString: "$chatId" },
                        senderId: 1,
                        type: 1,
                        content: 1,
                        callStatus:1,
                        createdAt: 1,
                        isRead: 1,
                    },
                },
            ]),
            ChatMessageModel.countDocuments({ chatId }),
        ]);
        const ordered = messages.reverse(); // reversing it for ui ux [{hlo}, {i am jomi}]

        return { data: ordered, total };
    }

    /** @inheritdoc */
    async createChatMessage(
        chatId: string,
        senderId: string,
        content: string,
        type: "text" | "call",
        status?: CallStatus,
    ): Promise<ChatMessage> {

        const callStatus = type === "call" ? status : undefined;

        const messageDoc = await ChatMessageModel.create({
            chatId: new mongoose.Types.ObjectId(chatId),
            senderId,
            content,
            type,
            callStatus
        });

        return {
            id: messageDoc._id.toString(),
            chatId: messageDoc.chatId.toString(),
            senderId: messageDoc.senderId,
            content: messageDoc.content,
            type: messageDoc.type,
            ...(messageDoc.callStatus && { callStatus: messageDoc.callStatus }),
            isRead: messageDoc.isRead,
            isActive: messageDoc.isActive,
            createdAt: messageDoc.createdAt,
            updatedAt: messageDoc.updatedAt,
        };
    }

}