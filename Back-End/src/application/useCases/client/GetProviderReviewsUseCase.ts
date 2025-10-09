import { IRatingRepository } from "../../../domain/interface/RepositoryInterface/IRaitingRepository";
import { HttpStatusCode } from "../../../shared/Enums/HttpStatusCode";
import { Messages } from "../../../shared/const/Messages";
import { ReviewInputDTO, ReviewOutputDTO } from "../../DTO's/ReviewDTO";
import { IGetProviderReviewsUseCase } from "../../Interface/useCases/Client/IGetProviderReviewsUseCase";

const { INTERNAL_SERVER_ERROR } = HttpStatusCode;
const { INTERNAL_ERROR } = Messages;

export class GetProviderReviewsUseCase implements IGetProviderReviewsUseCase {
    constructor(
        private readonly _ratingRepository: IRatingRepository,
    ) { }

    async execute(input: ReviewInputDTO): Promise<ReviewOutputDTO> {
        try {

            const { providerId, currentPage, limit } = input;

            const reviewData = await this._ratingRepository.findProviderReviews(
                providerId,
                currentPage,
                limit
            );

            const mappedData = reviewData.data.map((item) => ({
                ratingData: {
                    rating: item.rating.rating,
                    feedback: item.rating.feedback,
                    createdAt: item.rating.createdAt,
                },
                userData: {
                    userId: item.user.userId,
                    fname: item.user.fname,
                    lname: item.user.lname,
                },
            }));

            const totalPages = Math.ceil(reviewData.total / limit);

            return {
                data: mappedData,
                total: totalPages
            };

        } catch (error) {
            if (error.message) {
                throw error;
            }
            throw { status: INTERNAL_SERVER_ERROR, message: INTERNAL_ERROR };
        }
    }
}

/*
           if (error instanceof Error) {
                const appError = new AppError(INTERNAL_SERVER_ERROR, error.message || "Internal Server Error");
                appError.stack = error.stack;
                throw appError;
            }

            if (error instanceof AppError) {
                throw error;
            }
            
            throw new AppError(INTERNAL_SERVER_ERROR, INTERNAL_ERROR);
*/