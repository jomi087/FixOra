import { Schema ,Document,model } from "mongoose";
import { Booking } from "../../../domain/entities/BookingEntity";
import { BookingStatus } from "../../../shared/Enums/BookingStatus";
import { ProviderResponseStatus } from "../../../shared/Enums/ProviderResponse";
import { PaymentMode, PaymentStatus } from "../../../shared/Enums/Payment";

export interface IBookingModel extends Document,Booking{}

const BookingSchema = new Schema<IBookingModel>({
    bookingId: {
        type: String,
        unique : true,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    providerUserId: {    
        type: String,
        required: true
    },
    provider: {
        id: {
            type: String,
            required: true
        },
        response: {
            type: String,
            enum: Object.values(ProviderResponseStatus),
            default: ProviderResponseStatus.PENDING,
        },
        reason: {
            type: String
        },
    },
    scheduledAt: {
        type: Date,
        required: true,
    },
    issueTypeId: {
        type: String,
        required: true
    },
    issue: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: Object.values(BookingStatus),
        default: BookingStatus.PENDING
    },
    pricing: {
        baseCost: {
            type: Number,
            required: true
        },
        distanceFee: {
            type: Number,
            default: 0,
        },
    },
    paymentInfo: {
        mop: {
            type: String,
            enum: Object.values(PaymentMode),
        },
        status: {
            type: String,
            enum: Object.values(PaymentStatus),
        },
        paidAt: {
            type: Date,
        },
        transactionId: {
            type : String,  
        },
        reason: {
            type: String
        },
    },
    esCrowAmout :  {
        type: Number,
    },
    diagnosed: {
        description: {
            type: String
        },
        replaceParts: {
            type: [
                {
                    name: String,
                    cost: Number,
                },
            ],
            default: undefined   
        }

    },
    acknowledgment: {
        isWorkCompletedByProvider: {
            type: Boolean,
        },
        imageUrl: {
            type: String
        },
        isWorkConfirmedByUser: {
            type: Boolean,
        },
    },
}, { timestamps: true });

const BookingModel = model<IBookingModel>("Booking", BookingSchema);

export default BookingModel;