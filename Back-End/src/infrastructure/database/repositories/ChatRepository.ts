import { PipelineStage } from "mongoose";
import { ChatListItem } from "../../../domain/entities/projections/ChatListItem";
import { IChatRepository } from "../../../domain/interface/RepositoryInterface/IChatRepository";
import { ChatModel } from "../models/ChatModel";
import { Chat } from "../../../domain/entities/ChatEntity";

export class ChatRepository implements IChatRepository {

    async findUserChats(userId: string, search?: string): Promise<ChatListItem[]> {
        console.log(userId, "userId", search, "search", typeof search);
        
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
            console.log("hi",search);
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

        let x = await ChatModel.aggregate(pipeline);
        console.log(x);
        return x;
    }

    
    async findChatBetweenUsers(participants: string[]): Promise<Chat | null> {
        const chatDoc = await ChatModel.findOne({ participants: { $all: participants, $size: participants.length } });

        if (!chatDoc) return null;

        return {
            id: chatDoc._id.toString(),
            participants: chatDoc.participants,
        };
    }

    async createChat(participants: string[]): Promise<Chat> {
        const doc = await ChatModel.create({ participants });

        return {
            id: doc._id.toString(),
            participants: doc.participants,
        };
    }
}


/*
    async create(participants: string[]): Promise<Chat> {
        const doc = await ChatModel.create({ participants });

        return {
            id: doc._id.toString(),
            participants: doc.participants,
            createdAt: doc.createdAt,
        };
    }
    
    async findByChatId(chatId: string): Promise<Chat | null> {
        return null;
    }

    async findByParticipants(participants: string[]): Promise<Chat | null> {
        const doc = await ChatModel.findOne({
            participants: { $all: participants, $size: participants.length }
        });

        if (!doc) return null;

        return {
            id: doc._id.toString(),
            participants: doc.participants,
            latestMessage: doc.latestMessage?.toString(),
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt
        };
    }
    */