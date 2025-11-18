export interface Chat {
    id?: string               // will be Mongo _id as string
    participants: string[]; // [userId, providerId] (UUIDs)
    latestMessageId?: string | null
    createdAt?: Date,
    updatedAt?: Date
}