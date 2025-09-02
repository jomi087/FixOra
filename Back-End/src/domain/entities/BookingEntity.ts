import { BookingStatus } from "../../shared/Enums/BookingStatus";
import { PaymentMode, PaymentStatus } from "../../shared/Enums/Payment";
import { ProviderResponseStatus } from "../../shared/Enums/ProviderResponse";

export interface Booking {
    bookingId: string;//uuid
    userId: string;
    providerUserId: string;
    provider: {
        id: string;
        response: ProviderResponseStatus //pending/Accept/reject (default pending)
        reason?: string;
    },
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
        paidAt: Date;
        transactionId?: string
        reason?: string; //refund reason 
    }

    esCrowAmout?: number
    
    diagnosed?: {
        description: string;
        replaceParts?: {
            name: string;
            cost: number;
        }[]
    }

    acknowledgment?: {
        isWorkCompletedByProvider: boolean;
        imageUrl?: string;
        isWorkConfirmedByUser: boolean;
    }
    createdAt?: Date;
    updatedAt?: Date;

}
