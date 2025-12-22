import { IRatingRepository } from "../../../domain/interface/repositoryInterface/IRaitingRepository";
import { ReviewInputDTO, ReviewOutputDTO } from "../../dtos/ReviewDTO";
import { IGetProviderReviewsUseCase } from "../../Interface/useCases/client/IGetProviderReviewsUseCase";


export class GetProviderReviewsUseCase implements IGetProviderReviewsUseCase {
    constructor(
        private readonly _ratingRepository: IRatingRepository,
    ) { }

    async execute(input: ReviewInputDTO): Promise<ReviewOutputDTO> {
        try {

            const { providerId, currentPage, limit } = input;

            const reviewData = await this._ratingRepository.findActiveProviderReviews(
                providerId,
                currentPage,
                limit
            );

            const mappedData = reviewData.data.map((item) => ({
                ratingData: {
                    ratingId: item.rating.ratingId,
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

        } catch (error: unknown) {
            throw error;
        }
    }
}
