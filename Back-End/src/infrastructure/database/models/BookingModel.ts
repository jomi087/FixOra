import { Schema ,Document,model } from "mongoose";
import { Booking } from '../../../domain/entities/BookingEntity.js';
import { BookingStatus } from "../../../shared/Enums/BookingStatus.js";

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
    providerId: {
        type: String,
        required: true
    },
    providerUserId: {    
        type: String,
        required: true
    },
    fullDate: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
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
    reason: {
        type : String
    }
}, { timestamps: true })

const BookingModel = model<IBookingModel>('Booking', BookingSchema);

export default BookingModel