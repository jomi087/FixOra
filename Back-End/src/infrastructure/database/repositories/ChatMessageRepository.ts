import mongoose from "mongoose";
import { ChatMessageListItem } from "../../../domain/entities/projections/ChatMessageListItem";
import { IChatMessageRepository } from "../../../domain/interface/RepositoryInterface/IChatMessageRepository";
import { ChatMessageModel } from "../models/ChatMessageModel";

export class ChatMessageRepository implements IChatMessageRepository {
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
                        content: 1,
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
}