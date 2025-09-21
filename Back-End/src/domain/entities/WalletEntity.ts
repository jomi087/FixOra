import { TransactionStatus, TransactionType } from "../../shared/Enums/Transaction";

export interface Transaction {
  transactionId: string;
  //fromUserId?: string;   // who initiated
  //toUserId?: string;     // who received
  amount: number;
  status: TransactionStatus;
  type: TransactionType;
  reason?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface Wallet {
  userId: string;
  balance: number;
  transactions: Transaction[];
  createdAt: Date;
  updatedAt?: Date;
}