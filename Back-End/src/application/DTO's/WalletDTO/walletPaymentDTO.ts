import { BookingStatus } from "../../../shared/enums/BookingStatus";
import { PaymentMode, PaymentStatus } from "../../../shared/enums/Payment";

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