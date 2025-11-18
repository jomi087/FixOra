import { Schema, model, Document, Types } from "mongoose";

export interface ChatDocument extends Document {
    _id: Types.ObjectId; 
    participants: string[];
    latestMessageId?: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const ChatSchema = new Schema<ChatDocument>(
    {
        participants: {   // extandable cutently config to 1 -1 chat in futire i can convert this to a group chat aalso
            type: [String],
            required: true,
            validate: {
                validator: (v: string[]) => v.length >= 2,
                message: "A chat must have at least 2 participants."
            },
            index: true
        },
        latestMessageId: {
            type: Schema.Types.ObjectId,
            ref: "ChatMessage",
        }
    },
    { timestamps: true }
);

export const ChatModel = model<ChatDocument>("Chat", ChatSchema);