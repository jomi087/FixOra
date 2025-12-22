import { PipelineStage } from "mongoose";
import { Wallet } from "../../../domain/entities/WalletEntity";
import { IWalletRepository } from "../../../domain/interface/repositoryInterface/IWalletRepository";
import { TransactionStatus, TransactionType } from "../../../shared/enums/Transaction";
import WalletModel from "../models/WalletModel";

export class WalletRepository implements IWalletRepository {
    async findByUserId(userId: string): Promise<Wallet | null> {
        return await WalletModel.findOne({ userId });
    }

    async create(data: Wallet): Promise<void> {
        await new WalletModel(data).save();
    }

    async updateWalletOnTransaction(params: {
        userId: string;
        transactionId: string; amount: number;
        status: TransactionStatus; type: TransactionType;
        reason?: string;
        metadata?: object
    }): Promise<void> {

        const { userId, transactionId, amount, status, type, reason, metadata  } = params;

        const transaction = {
            transactionId,
            amount,
            status,
            type,
            createdAt: new Date(),
            ...(reason ? { reason } : {}),
            ...(metadata ? { metadata } : {}),
        };

        let balanceUpdate: { $inc?: { balance: number } } = {};
        if (status === TransactionStatus.SUCCESS) {
            if (type === TransactionType.CREDIT || type === TransactionType.REFUND) {
                balanceUpdate = { $inc: { balance: amount } };
            } else if (type === TransactionType.DEBIT) {
                balanceUpdate = { $inc: { balance: -amount } };
            }
        }

        const update = {
            ...balanceUpdate,
            $push: { transactions: transaction },
        };

        await WalletModel.findOneAndUpdate(
            { userId },
            update,
            { new: true }
        );
    }

    async findByUserIdWithTransactions(
        userId: string,
        currentPage: number,
        limit: number
    ): Promise<{ data: Wallet; totalTransactions: number } | null> {
        const skip = (currentPage - 1) * limit;

        const pipeline: PipelineStage[] = [
            { $match: { userId } },
            { $unwind: { path: "$transactions", preserveNullAndEmptyArrays: true } },
            { $sort: { "transactions.createdAt": -1 } },
            {
                $facet: {
                    data: [
                        { $skip: skip },
                        { $limit: limit },
                        {
                            $group: {
                                _id: "$_id",
                                userId: { $first: "$userId" },
                                balance: { $first: "$balance" },
                                createdAt: { $first: "$createdAt" },
                                updatedAt: { $first: "$updatedAt" },
                                transactions: { $push: "$transactions" },
                            },
                        },
                    ],
                    total: [{ $count: "count" }],
                },
            },
            {
                $project: {
                    data: { $arrayElemAt: ["$data", 0] },
                    totalTransactions: { $ifNull: [{ $arrayElemAt: ["$total.count", 0] }, 0] },
                },
            },
        ];

        const result = await WalletModel.aggregate(pipeline);
        if (!result.length || !result[0].data) return null;

        return {
            data: result[0].data as Wallet,
            totalTransactions: result[0].totalTransactions,
        };
    }

} 