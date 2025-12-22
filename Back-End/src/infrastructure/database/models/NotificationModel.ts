import { Schema, Document, model } from "mongoose";
import { Notification } from "../../../domain/entities/NotificationEntity";
import { NotificationType } from "../../../shared/enumss/Notification";

export interface INotificationModel extends Document, Notification { }

const NotificationSchema = new Schema<INotificationModel>({
    notificationId: {
        type: String,
        unique: true,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: Object.values(NotificationType),
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    metadata: {
        type: Schema.Types.Mixed, // flexible object
        default: {},
    },
    isRead: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

const NotificationModel = model<INotificationModel>("Notification", NotificationSchema);

export default NotificationModel;