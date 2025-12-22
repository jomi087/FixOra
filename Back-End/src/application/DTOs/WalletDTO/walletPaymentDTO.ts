import { BookingStatus } from "../../../shared/enumss/BookingStatus";
import { PaymentMode, PaymentStatus } from "../../../shared/enumss/Payment";

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