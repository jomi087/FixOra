import { TransactionStatus, TransactionType } from "../../../shared/enums/Transaction";
import { Wallet } from "../../entities/WalletEntity";

export interface IWalletRepository {
    findByUserId(userId: string,): Promise<Wallet | null>;

    create(data: Wallet): Promise<void>;

    updateWalletOnTransaction(params: {
        userId: string;
        transactionId: string; amount: number;
        status: TransactionStatus; type: TransactionType; 
        reason?: string;
    }): Promise<void>

    findByUserIdWithTransactions(
        userId: string,
        currentPage: number, limit: number
    ): Promise<{ data: Wallet, totalTransactions: number } | null>
} 