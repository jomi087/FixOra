import { BookingStatus } from "../../shared/enumss/BookingStatus";
import { PaymentMode, PaymentStatus } from "../../shared/enumss/Payment";
import { ProviderResponseStatus } from "../../shared/enumss/ProviderResponse";

export interface Booking {
    bookingId: string;//uuid
    userId: string;
    location: {
        address: string;
        lat: number;
        lng: number;
    },
    providerUserId: string;
    provider: {
        id: string;
        response: ProviderResponseStatus
        reason?: string;
    },
    scheduledAt: Date;
    issueTypeId: string; //subcategoryId
    issue: string;
    status: BookingStatus;
    pricing: {
        baseCost: number;
        distanceFee: number;
    };
    commission: number;
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
