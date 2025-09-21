import { BookingStatus } from "../../../shared/Enums/BookingStatus";
import { PaymentMode, PaymentStatus } from "../../../shared/Enums/Payment";

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