import { BookingStatus } from "../../shared/Enums/BookingStatus";
import { PaymentMode, PaymentStatus } from "../../shared/Enums/Payment";
import { ProviderResponseStatus } from "../../shared/Enums/ProviderResponse";

export interface Booking {
    bookingId: string;//uuid
    userId: string;
    providerUserId: string;
    provider: {
        id: string;
        response: ProviderResponseStatus //pending/Accept/reject 
        reason?: string;
    },
    scheduledAt: Date;
    issueTypeId: string;
    issue: string;
    status: BookingStatus; //pending , confirm , cancel  
    pricing: {
        baseCost: number;
        distanceFee: number;
    }
    paymentInfo ?: {
        mop: PaymentMode; //wallet , online
        status: PaymentStatus; //pending,failed,success,refunded 
        paidAt: Date;
        transactionId?: string
        reason?: string; 
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
        imageUrl?: string[];
        isWorkConfirmedByUser: boolean;
    }
    createdAt?: Date;
    updatedAt?: Date;

}
