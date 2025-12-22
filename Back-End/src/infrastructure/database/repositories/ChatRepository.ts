import mongoose, { PipelineStage } from "mongoose";
import { ChatListItem } from "../../../domain/entities/projections/ChatListItem";
import { IChatRepository } from "../../../domain/interface/repositoryInterfaceTempName/IChatRepository";
import { ChatModel } from "../models/ChatModel";
import { Chat } from "../../../domain/entities/ChatEntity";

export class ChatRepository implements IChatRepository {

    /** @inheritdoc */
    async findUserChats(userId: string, search?: string): Promise<ChatListItem[]> {
        const pipeline: PipelineStage[] = [
            {
                $match: {
                    participants: userId
                }
            },
            {
                $sort: {
                    updatedAt: -1
                }
            },
            {
                $addFields: {
                    partnerId: {
                        $arrayElemAt: [
                            {
                                $filter: {
                                    input: "$participants",
                                    as: "p",
                                    cond: { $ne: ["$$p", userId] }
                                }
                            },
                            0
                        ]
                    }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "partnerId",
                    foreignField: "userId",
                    as: "partner"
                }
            },
            { $unwind: "$partner" }
        ];

        if (search && search.trim()) {
            pipeline.push({
                $match: {
                    $or: [
                        { "partner.fname": { $regex: search, $options: "i" } },
                        { "partner.lname": { $regex: search, $options: "i" } },
                    ]
                }
            });
        }

        pipeline.push(
            {
                $lookup: {
                    from: "chatmessages",
                    localField: "latestMessageId",
                    foreignField: "_id",
                    as: "latestMessage"
                }
            },
            {
                $unwind: { path: "$latestMessage", preserveNullAndEmptyArrays: true }
            },
            {
                $project: {
                    _id: 0,
                    id: { $toString: "$_id" },
                    partner: {
                        id: "$partner.userId",
                        fname: "$partner.fname",
                        lname: "$partner.lname"
                    },
                    latestMessage: {
                        $cond: [
                            { $ifNull: ["$latestMessage", false] },
                            {
                                id: { $toString: "$latestMessage._id" },
                                senderId: "$latestMessage.senderId",
                                content: "$latestMessage.content",
                                createdAt: "$latestMessage.createdAt"
                            },
                            null
                        ]
                    }
                }
            }
        );

        return await ChatModel.aggregate(pipeline);
    }

    /** @inheritdoc */
    async findChatBetweenUsers(participants: string[]): Promise<Chat | null> {
        const chatDoc = await ChatModel.findOne({ participants: { $all: participants, $size: participants.length } });

        if (!chatDoc) return null;

        return {
            id: chatDoc._id.toString(),
            participants: chatDoc.participants,
        };
    }

    /** @inheritdoc */
    async createChat(participants: string[]): Promise<Chat> {
        const doc = await ChatModel.create({ participants });
        return {
            id: doc._id.toString(),
            participants: doc.participants,
        };
    }

    /** @inheritdoc */
    async updateLatestMessage(chatId: string, messageId: string): Promise<void> {
        await ChatModel.findByIdAndUpdate(chatId, {
            latestMessageId: new mongoose.Types.ObjectId(messageId),
            updatedAt: new Date(),
        });
    }

    /** @inheritdoc */
    async getChatById(chatId: string): Promise<Chat | null> {
        const chatDoc = await ChatModel.findById(chatId).lean();

        if (!chatDoc) return null;

        return {
            id: chatDoc._id.toString(),
            participants: chatDoc.participants,
            latestMessageId: chatDoc.latestMessageId?.toString() || null,
            createdAt: chatDoc.createdAt,
            updatedAt: chatDoc.updatedAt
        };
    }
}

