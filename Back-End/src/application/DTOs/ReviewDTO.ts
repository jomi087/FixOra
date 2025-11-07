import { Rating } from "../../domain/entities/RatingEntity";
import { User } from "../../domain/entities/UserEntity";
import { PaginationInputDTO, PaginationOutputDTO } from "./Common/PaginationDTO";

export interface ReviewInputDTO extends Omit<PaginationInputDTO, "searchQuery" | "filter"> {
    providerId: string;
}

export interface ReviewOutputDTO extends PaginationOutputDTO<{
    ratingData: Pick<Rating, "ratingId" | "rating" | "feedback" | "createdAt">;
    userData: Pick<User, "userId" | "fname" | "lname">;
}> { }

export interface AddReviewInputDTO {
    bookingId: string;
    rating: number;
    feedback: string;
}

export interface UpdateReviewInputDTO {
    ratingId: string;
    rating?: number;
    feedback?: string;
}

export interface UpdateReviewOutputDTO {
    ratingId: string;
    rating: number;
    feedback: string;
}
