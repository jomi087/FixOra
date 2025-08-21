import { BookingStatus } from "../../shared/Enums/BookingStatus.js";
import { PaymentMode, PaymentStatus } from "../../shared/Enums/Payment.js";
import { ProviderResponseStatus } from "../../shared/Enums/ProviderResponse.js";

export interface Booking {
    bookingId: string;//uuid
    userId: string;
    providerUserId: string;
    provider: {
        id: string;
        response: ProviderResponseStatus //pending/Accept/reject (default pending)
        reason?: string;
    },
    // fullDate: string;
    // time: string;
    scheduledAt: Date;
    issueTypeId: string;
    issue: string;
    status: BookingStatus; //pending , confirm , cancel  (default pending)
    pricing: {
        baseCost: number;
        distanceFee: number;
    }
    paymentInfo ?: {
        mop: PaymentMode; //wallet , online (defualt wallet)
        status: PaymentStatus; //pending,failed,success,refunded (default pending)
        paidAt?: Date;
        reason?: string; //refund reason 
    }
    esCrowInfo ?: {
        toProvider: number; //default 0
        toAdmin: number; // default 0
    }
    diagnosed?: {
        description: string;
        replaceParts?: {
            name: string;
            cost: number; //
        }[]
    }
    acknowledgment?: {
        isWorkCompletedByProvider: boolean;
        imageUrl: string;
        isWorkConfirmedByUser: boolean;
    }
    createdAt?: Date;
    updatedAt?: Date;
}
