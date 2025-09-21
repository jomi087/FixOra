import { BookingStatus } from "../../../shared/Enums/BookingStatus";
import { PaymentMode, PaymentStatus } from "../../../shared/Enums/Payment";
import { AddressDTO } from "../Common/AddressDTO";

export interface ConfirmBookingOutputDTO {
    bookingId: string;
    scheduledAt: Date;
    status: BookingStatus;
    acknowledgment: {
        isWorkCompletedByProvider: boolean;
        isWorkConfirmedByUser: boolean;
    }
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
    acknowledgment: {
        isWorkCompletedByProvider: boolean;
        imageUrl: string[];
        isWorkConfirmedByUser: boolean;
    };
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
    paymentInfo: {
        mop: PaymentMode;
        status: PaymentStatus;
        paidAt: Date;
        transactionId: string
        reason?: string;
    }
    acknowledgment: {
        isWorkCompletedByProvider: boolean;
        imageUrl: string[];
        isWorkConfirmedByUser: boolean;
    };
}
