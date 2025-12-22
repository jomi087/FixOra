import { TransactionStatus, TransactionType } from "../../../shared/enumss/Transaction";
import { PaginationInputDTO } from "../Common/PaginationDTO";

export interface Transaction {
    transactionId: string;
    amount: number;
    type: TransactionType;
    status: TransactionStatus;
    date: Date;
    bookingId?: string;
}

export interface WalletDTO{
    userId: string;
    balance: number;
    transactions: Transaction[];
}


export interface WalletInputDTO extends Omit<PaginationInputDTO, "searchQuery" | "filter"> {
    userId: string;
}

export interface WalletOutputDTO {
    data: WalletDTO;
    total: number;
}