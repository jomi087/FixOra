import { BookingStatus } from "../../../shared/Enums/BookingStatus";

export interface WalletPaymentInputDTO {
    userId: string;
    bookingId: string;
}

export interface WalletPaymentOutputDTO {
    bookingId: string;
    status: BookingStatus;
}