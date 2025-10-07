import { BookingStatus } from "../../shared/Enums/BookingStatus";
import { PaymentMode, PaymentStatus } from "../../shared/Enums/Payment";
import { ProviderResponseStatus } from "../../shared/Enums/ProviderResponse";

export interface Booking {
    bookingId: string;//uuid
    userId: string;
    providerUserId: string;
    provider: {
        id: string;
        response: ProviderResponseStatus  
        reason?: string;
    },
    scheduledAt: Date;
    issueTypeId: string;
    issue: string;
    status: BookingStatus;
    pricing: {
        baseCost: number;
        distanceFee: number;
    }
    paymentInfo?: {
        mop: PaymentMode; 
        status: PaymentStatus;
        paidAt: Date;
        transactionId: string;
        reason?: string; 
    }
    esCrowAmout?: number;
    diagnosed?: {
        description: string;
        replaceParts?: {
            name: string;
            cost: number;
        }[]
    }
    workProof?: string[];
    cancelledAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}
