import mongoose, { Document, Schema } from "mongoose";
import { Availability, DaySchedule } from "../../../domain/entities/AvailabilityEntity";

export interface IAvailabilityModel extends Document, Availability { }

const dayScheduleSchema = new Schema<DaySchedule>({
    day: {
        type: String,
        enum: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        required: true,
    },
    slots: {
        type: [String],
        default: [],
    },
    active: {
        type: Boolean,
        default: false
    }
}, {
    _id: false
});

const AvailabilitySchema = new Schema<IAvailabilityModel>(
    {
        providerId: {
            type: String,
            required: true,
            unique: true,
        },
        workTime: {
            type: [dayScheduleSchema],
            default: [],
        }
    },
    { timestamps: true }
);

const AvailabilityModel = mongoose.model<IAvailabilityModel>("Availability", AvailabilitySchema);

export default AvailabilityModel;
