export interface Rating {
    ratingId: string;
    bookingId: string;
    providerId: string;
    userId: string;
    rating: number;
    feedback: string;
    active: boolean;
    createdAt: Date;
    updatedAt?: Date;
}