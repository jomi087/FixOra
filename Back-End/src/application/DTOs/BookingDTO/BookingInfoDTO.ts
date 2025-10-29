import { BookingStatus } from "../../../shared/enums/BookingStatus";
import { PaymentMode, PaymentStatus } from "../../../shared/enums/Payment";
import { AddressDTO } from "../Common/AddressDTO";

export interface ConfirmBookingOutputDTO {
    bookingId: string;
    scheduledAt: Date;
    status: BookingStatus;
}

export interface BookingDetailsOutputDTO {
    bookingId: string;
    providerUser: {
        userId: string;
        fname: string;
        lname: string;
        email: string;
        image: string
    };
    scheduledAt: Date;
    category: {
        categoryId: string;
        name: string;
        subCategory: {
            subCategoryId: string;
            name: string;
        };
    };
    issue: string;
    status: BookingStatus;
    pricing: {
        baseCost: number;
        distanceFee: number;
    };
    paymentInfo: {
        mop?: PaymentMode;
        status: PaymentStatus;
        paidAt?: Date;
        transactionId?: string
        reason?: string;
    }
    workProof?: string[];
    diagnosed?: {
        description: string;
        replaceParts?: {
            name: string;
            cost: number;
        }[]
    }
}

export interface CancelBookingInputDTO {
    userId: string;
    bookingId: string;
}

export interface CancelBookingOutputDTO {
    status: BookingStatus;
    paymentInfo: {
        status: PaymentStatus;
        reason: string;
    }
}

export interface RetryAvailabilityInputDTO extends CancelBookingInputDTO { }

export interface RetryAvailabilityOutputDTO {
    status: BookingStatus;
    paymentInfo: {
        status: PaymentStatus;
        reason: string;
    };
    reason: string;
}

export interface jobDetailsOutputDTO {
    bookingId: string;
    user: {
        userId: string;
        fname: string;
        lname: string;
        email: string;
        location?: AddressDTO
    };
    scheduledAt: Date;
    category: {
        categoryId: string;
        name: string;
        subCategory: {
            subCategoryId: string;
            name: string;
        };
    };
    issue: string;
    status: BookingStatus;
    pricing: {
        baseCost: number;
        distanceFee: number;
    };
    commission: number;
    paymentInfo: {
        mop: PaymentMode;
        status: PaymentStatus;
        paidAt: Date;
        transactionId: string
        reason?: string;
    }
    workProof?: string[];
    diagnosed?: {
        description: string;
        replaceParts?: {
            name: string;
            cost: number;
        }[]
    }
}
