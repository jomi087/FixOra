import { Schema, Document, model } from "mongoose";
import { Booking } from "../../../domain/entities/BookingEntity";
import { BookingStatus } from "../../../shared/enums/BookingStatus";
import { ProviderResponseStatus } from "../../../shared/enums/ProviderResponse";
import { PaymentMode, PaymentStatus } from "../../../shared/enums/Payment";

export interface IBookingModel extends Document, Booking { }

const BookingSchema = new Schema<IBookingModel>({
    bookingId: {
        type: String,
        unique: true,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    location: {
        address: { type: String },
        lat: { type: Number },
        lng: { type: Number },
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
    commission: {
        type: Number,
        required: true,
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
            type: String,
        },
        reason: {
            type: String
        },
    },
    esCrowAmout: {
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
    workProof: {
        type: [String],
        default: [],
    },
    cancelledAt: {
        type: Date
    }
}, { timestamps: true });

BookingSchema.index({
    "provider.response": 1,
    status: 1,
});

const BookingModel = model<IBookingModel>("Booking", BookingSchema);

export default BookingModel;