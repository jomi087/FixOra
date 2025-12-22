import { TransactionStatus, TransactionType } from "../../shared/enums/Transaction";
import { PaginationInputDTO } from "./Common/PaginationDTO";
import { BookingStatus } from "../../shared/enums/BookingStatus";
import { PaymentMode, PaymentStatus } from "../../shared/enums/Payment";

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



export interface WalletPaymentInputDTO {
    userId: string;
    bookingId: string;
}

export interface WalletPaymentOutputDTO {
    bookingId: string;
    status: BookingStatus;
    paymentInfo: {
        mop: PaymentMode;
        status: PaymentStatus;
        paidAt: Date;
        transactionId: string;
    }
}