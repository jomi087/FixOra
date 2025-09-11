import type { TransactionStatus, TransactionType } from "../enums/Transaction";

export interface Transaction {
  transactionId: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  date: string;
}

export interface WalletInfo {
  userId: string;
  balance: number;
  transactions: Transaction[];
}
