export interface AddFeedbackInputDTO {
    bookingId: string;
    rating: number;
    feedback: string;
}

export interface updateFeedbackInputDTO {
    rating: number;
    feedback: string;
}